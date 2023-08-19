	import Ajv from "ajv";
	import metaData from "../resources/schema/metadata.json"
	import claimData from "../resources/schema/claimdata.json"
	const ajv = new Ajv.default({ allErrors: true });
	ajv.addSchema(metaData, "metaData");
	ajv.addSchema(claimData, "claimData");
	const validateMetaData = (data) => {
	    let validate = ajv.getSchema("metaData");
	    if (!validate) {
	        return { valid: false, errors: {} };
	    }
	    if (validate(data)) {
	        return { valid: true, errors: {} };
	    } else {
	        const errors = {};
	        for (const e of validate.errors || []) {
	            const key = e.params.missingProperty || "other";
	            if (key && e.message) {
	                errors[key] = e.message;
	            }
	        }
	        return {
	            valid: false,
	            errors,
	        };
	    }
	};
	const validateClaimData = (data) => {
	    let validate = ajv.getSchema("claimData");
	    if (!validate) {
	        return { valid: false, errors: {} };
	    }
	    if (validate(data)) {
	        return { valid: true, errors: {} };
	    } else {
	        const errors = {};
	        for (const e of validate.errors || []) {
	            const key = e.params.missingProperty || "other";
	            if (key && e.message) {
	                errors[key] = e.message;
	            }
	        }
	        return {
	            valid: false,
	            errors,
	        };
	    }
	};
	export { validateMetaData, validateClaimData };