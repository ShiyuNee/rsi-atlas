# coding: utf-8
"""Attach explicit mechanism classifications after every catalog source is merged.

Historical notes and their raw occurrences stay unchanged. Unknown actors are
never inferred from titles, model names, old tags, or prose keywords.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METHOD_TYPES = {'harness', 'artifact', 'weights', 'joint'}
MODIFIER_ROLES = {
    'SelfModifier', 'SelfSystem', 'SelfArtifact', 'OtherModifier',
    'OtherEditor', 'OtherTeacher', 'UnknownModifier', 'NotApplicableModifier',
}
PARAMETER_TARGETS = {'TaskModelWeights', 'EditorWeights', 'RouterWeights', 'EvaluatorWeights'}
SKILL_KINDS = {'SkillDocument', 'SkillCode'}
DEPTHS = {'M0', 'M1', 'M2', 'M3', '未明确', '非持久／不适用'}


def _values(values, allowed, field, pid):
    if not isinstance(values, list) or len(set(values)) != len(values):
        raise ValueError(f'{pid}: {field} must be an array of unique values')
    if set(values) - allowed:
        raise ValueError(f'{pid}: unsupported {field}: {set(values) - allowed}')
    return list(values)


def attach_mechanism_classifications(output):
    """Mutate and return the complete build output, including curated resources."""
    maintained = json.loads((ROOT / 'data/mechanism-classifications.json').read_text())
    overrides = maintained['papers']
    ids = {p['id'] for p in output['papers']}
    if set(overrides) - ids:
        raise ValueError(f'Classification has no matching paper: {set(overrides) - ids}')
    output['mechanismClassificationPolicy'] = maintained['policy']
    output['mechanismClassificationDate'] = maintained['updated']

    for p in output['papers']:
        pid = p['id']
        correction = overrides.get(pid, {})
        if correction and not correction.get('sources'):
            raise ValueError(f'{pid}: classification correction needs source locations')
        if 'methodType' in correction:
            p['methodType'] = correction['methodType']
        primary = p.get('methodType', '')
        types = correction.get('methodTypes', p.get('methodTypes', [primary] if primary else []))
        p['methodTypes'] = _values(types, METHOD_TYPES, 'methodTypes', pid)
        if primary and primary not in p['methodTypes']:
            raise ValueError(f'{pid}: methodTypes must retain the primary methodType')
        if p['category'] != 'methods' and p['methodTypes']:
            raise ValueError(f'{pid}: non-method item cannot have methodTypes')

        # Explicit metadata on newly added items takes precedence over defaults.
        # Non-method articles are not assumed to have, or lack, a self modifier.
        default_roles = ['UnknownModifier'] if p['category'] == 'methods' else []
        roles = correction.get('modifierRoles', p.get('modifierRoles', default_roles))
        p['modifierRoles'] = _values(roles, MODIFIER_ROLES, 'modifierRoles', pid)
        if set(roles) & {'UnknownModifier', 'NotApplicableModifier'} and len(roles) != 1:
            raise ValueError(f'{pid}: unknown/not-applicable roles cannot assert known actors')
        if set(roles) & {'SelfSystem', 'SelfArtifact'} and 'SelfModifier' not in roles:
            raise ValueError(f'{pid}: a self-modification subtype requires SelfModifier')
        if set(roles) & {'OtherEditor', 'OtherTeacher'} and 'OtherModifier' not in roles:
            raise ValueError(f'{pid}: an external actor subtype requires OtherModifier')
        for field, allowed in [('parameterTargets', PARAMETER_TARGETS), ('skillKinds', SKILL_KINDS)]:
            p[field] = _values(correction.get(field, p.get(field, [])), allowed, field, pid)
        if 'depth' in correction:
            p['historicalDepth'] = list(p.get('depth', []))
            p['depth'] = _values(correction['depth'], DEPTHS, 'depth', pid)
            p['depthBasis'] = correction['depthBasis']

        tags = set(p.get('tags', [])) - set(correction.get('removeTags', []))
        tags.update(correction.get('addTags', []))
        tags.update(p['parameterTargets'])
        tags.update(p['skillKinds'])
        if 'depth' in correction:
            tags -= {'M0', 'M1', 'M2', 'M3'}
            tags.update(d for d in p['depth'] if d.startswith('M'))
        p['tags'] = sorted(tags)
        sources = list(correction.get('sources', []))
        for source in p.get('classificationSources', []):
            if source not in sources:
                sources.append(source)
        if roles and not set(roles) & {'UnknownModifier', 'NotApplicableModifier'} and not sources:
            raise ValueError(f'{pid}: explicit modifier roles need classificationSources')
        p['mechanismClassification'] = {
            **correction,
            'sources': sources,
            'modifierStatus': ('unknown' if 'UnknownModifier' in roles else
                               'not-applicable' if 'NotApplicableModifier' in roles else
                               'recorded' if roles else 'not-classified'),
        }

    # A primary count is additive; overlapping object counts must not be summed.
    output['methodTypeCounts'] = {
        t: sum(p.get('methodType') == t for p in output['papers']) for t in sorted(METHOD_TYPES)
    }
    output['methodObjectCounts'] = {
        t: sum(t in p['methodTypes'] for p in output['papers']) for t in sorted(METHOD_TYPES)
    }
    return output
