require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate get and update articles functionality', () => {
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
    });

     it('should get current user articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', cookie: cookie },
        })
            .then(res => {
                expect(res.status).toEqual(200)
                return res.json()
            })
            .then(res => {
                done();
            })
    });

    it('should get current user articles', (done) => {
        fetch(url('/articles/1'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', cookie: cookie },
        })
            .then(res => {
                expect(res.status).toEqual(200)
                return res.json()
            })
            .then(res => {
                expect(res.articles[0].author).toEqual("Andrew");
                done();
            })
    });

    it('should add an article', (done) => {
        let post = {text: "THis is a test article .s.d.s.ds."}
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  cookie: cookie },
            body: JSON.stringify(post)
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json()
        }).then (res => {
            done();
        })
    });

    

});