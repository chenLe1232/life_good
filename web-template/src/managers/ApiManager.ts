export function login() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                name: 'xforge'
            })
        }, 1000);
    })
}