





export const delete_label_command = async (labelId: string): Promise<void> => {
    const api_response = await fetch(`http://localhost:8080/${labelId}`, {
        method: 'DELETE'
    });
    if (api_response.status !== 200) {
        throw new Error(`Delete api responded with status code ${api_response.status}`)
    } 
};
