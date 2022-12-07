require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate get and update headline functionality', () => {
    let cookie;

    beforeEach((done) => {
        let user = {username: "testUser", password:'123'}
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json();
        }).then(res => {
            done();
        })
    })

    it('should get the user`s headline', (done) => {
        fetch(url('/headline/testUser'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', cookie: cookie},
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('Free');
            done();
        });
    });

    it('should update the test user`s headline', (done) => {
        let headline = {headline: "HAPPY"}
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(headline)
        }).then(res => 
            {
                cookie = res.headers.get('set-cookie');
                return res.json();
            })
            .then(res => {
            expect(res.headline).toEqual('HAPPY');
            done();
        })
    });

});