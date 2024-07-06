async function logout () {
    const backendUrlAddress = import.meta.env.VITE_BACKEND_ADDRESS
    const url = `${backendUrlAddress}/logout`
    await fetch (url, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

export {logout};