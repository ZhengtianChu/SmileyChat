require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Validate register and log functionality', () => {
    let cookie;

    it('should register a test user', (done) => {
        let user = {username: "testUser", password:'123'}
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should log in the test user', (done) => {

        let user = {username: "testUser", password:'123'}
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json();
        }).then(res => {

            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        })
    });
    
    it('should log out the user', (done) => {
        let user = {username: "testUser", password:'123'}
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            fetch(url('/logout'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            }).then(res => res.json()).then(res => {
                expect(res.result).toEqual('OK');
                done();
            });
        })
    })
});