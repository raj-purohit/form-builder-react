export const ACTION_TYPES = {
    ADDED_FORM      : "ADDED_FORM"
}

export const addForm = (data) => {
    localStorage.setItem('forms', JSON.stringify(data))
    return {
        type : ACTION_TYPES.ADDED_FORM,
        data
    }
}