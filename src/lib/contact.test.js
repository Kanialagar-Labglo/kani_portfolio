import { describe, expect, it } from 'vitest';
import { whatsappUrl } from './contact.js';

describe('whatsappUrl', () => {
  it('opens a chat with the number and a pre-filled greeting', () => {
    expect(whatsappUrl({ number: '918248570855', message: 'Hi there!' })).toBe(
      'https://wa.me/918248570855?text=Hi%20there!',
    );
  });

  it('keeps only the digits of the number', () => {
    expect(whatsappUrl({ number: '+91 82485-70855', message: 'Hi' })).toBe(
      'https://wa.me/918248570855?text=Hi',
    );
  });

  it('encodes characters that are not safe in an address', () => {
    const url = new URL(whatsappUrl({ number: '911', message: "I'd like to connect & chat" }));

    expect(url.searchParams.get('text')).toBe("I'd like to connect & chat");
  });

  it('leaves out the greeting when there is none', () => {
    expect(whatsappUrl({ number: '911' })).toBe('https://wa.me/911');
  });
});
