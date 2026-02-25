import { useState, useCallback } from "react";

export const useForm = (initialValues, validate, onSubmit) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        // Live re-validate if already touched
        setErrors((prev) => {
            const newVals = { ...values, [name]: value };
            const newErrors = validate(newVals);
            return { ...prev, [name]: newErrors[name] };
        });
    }, [values, validate]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const newErrors = validate(values);
        setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }, [values, validate]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            // Touch all fields
            const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
            setTouched(allTouched);
            const newErrors = validate(values);
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                onSubmit(values);
            }
        },
        [values, validate, onSubmit]
    );

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset };
};
