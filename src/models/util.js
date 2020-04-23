import { v4 as uuidv4 } from 'uuid';

export const generateId = () => {
  const encodeMap = {
    '+': '-',
    '/': '_',
    '=': '',
  };
  const buf = Buffer.alloc(16);
  uuidv4(null, buf);
  return buf.toString('base64').replace(/[+/=]/g, (m) => encodeMap[m]);
};
