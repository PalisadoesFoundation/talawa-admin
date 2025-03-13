import Fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

const PORT = Number(process.env.PROXY_PORT) || 5000; // Ensure PORT is a number
const TARGET_URL = process.env.TARGET_URL;
const ADMIN_PORT = process.env.ADMIN_PORT;
const ADMIN_ORIGIN = `http://localhost:${ADMIN_PORT}`;

fastify.register(cors, {
  origin: ADMIN_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight'],
  credentials: true,
});

fastify.register(replyFrom);

fastify.all('/*', async (req, reply) => {
  return reply.from(TARGET_URL, {
    rewriteRequestHeaders: (req, headers) => {
      return { ...headers };
    },
  });
});

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`🚀 Proxy running at ${address}`);
});
