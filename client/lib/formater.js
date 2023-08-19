import { validateClaimData, validateMetaData } from "./validator/index.js";
const formatDate = (date) => {
    const fullYear = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = (date.getDate() + 1).toString().padStart(2, "0");
    return `${fullYear}-${month}-${day}`;
};
export const formatHypercertData = ({ name, description, external_url, image, version, properties, impactScope, excludedImpactScope = [], workScope, excludedWorkScope = [], workTimeframeStart, workTimeframeEnd, impactTimeframeStart, impactTimeframeEnd, contributors, rights, excludedRights, }) => {
    const claimData = {
        impact_scope: {
            name: "Impact Scope",
            value: impactScope,
            excludes: excludedImpactScope,
            display_value: impactScope.join(", "),
        },
        work_scope: {
            name: "Work Scope",
            value: workScope,
            excludes: excludedWorkScope,
            display_value: workScope.join(", "),
        },
        impact_timeframe: {
            name: "Impact Timeframe",
            value: [impactTimeframeStart, impactTimeframeEnd],
            display_value: `${formatDate(new Date(impactTimeframeStart * 1000))} \u2192 ${formatDate(new Date(impactTimeframeEnd * 1000))}`,
        },
        work_timeframe: {
            name: "Work Timeframe",
            value: [workTimeframeStart, workTimeframeEnd],
            display_value: `${formatDate(new Date(workTimeframeStart * 1000))} \u2192 ${formatDate(new Date(workTimeframeEnd * 1000))}`,
        },
        rights: {
            name: "Rights",
            value: rights,
            excludes: excludedRights,
            display_value: rights.join(", "),
        },
        contributors: {
            name: "Contributors",
            value: contributors,
            display_value: contributors.join(", "),
        },
    };
    const { valid: claimDataValid, errors: claimDataErrors } = validateClaimData(claimData);
    if (!claimDataValid) {
        return { valid: false, errors: claimDataErrors, data: null };
    }
    const metaData = {
        name,
        description,
        external_url,
        image,
        version,
        properties,
        hypercert: claimData,
    };
    const { valid: metaDataValid, errors: metaDataErrors } = validateMetaData(metaData);
    if (!metaDataValid) {
        return { valid: false, errors: metaDataErrors, data: null };
    }
    return { valid: true, errors: {}, data: metaData };
};