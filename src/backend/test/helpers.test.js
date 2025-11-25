
import { describe, it, expect, beforeEach } from 'vitest';
const config = require('../src/config');
const { validate_signature_auth, sign_file } = require('../src/helpers');

describe('helpers', () => {
    beforeEach(() => {
        config.protocol = 'http';
        config.domain = 'puter.test';
        config.http_port = 3000;
        config.experimental_no_subdomain = true;
        config.url_signature_secret = 'a-secret-string-for-testing-purposes';
    });

    describe('validate_signature_auth', () => {
        it('should not allow a URL signed for "write" to be used for other actions', async () => {
            const fsentry = {
                uuid: 'test-uuid',
                name: 'test-file',
            };
            const signed = await sign_file(fsentry, 'write');
            const url = signed.write_url;

            expect(() => validate_signature_auth(url, 'read')).toThrow('Authentication failed');
            expect(() => validate_signature_auth(url, 'delete')).toThrow('Authentication failed');
            expect(() => validate_signature_auth(url, 'move')).toThrow('Authentication failed');
        });

        it('should allow a URL signed for "write" to be used for "write" action', async () => {
            const fsentry = {
                uuid: 'test-uuid',
                name: 'test-file',
            };
            const signed = await sign_file(fsentry, 'write');
            const url = signed.write_url;

            expect(() => validate_signature_auth(url, 'write')).not.toThrow();
        });
    });
});
