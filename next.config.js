import createJITI from 'jiti';
import { fileURLToPath } from 'node:url';

const jiti = createJITI(fileURLToPath(import.meta.url));
jiti("./src/env");

/** @type {import('next').NextConfig} */
export default {};

