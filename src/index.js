import { ApolloServer } from 'apollo-server';

import hooks from './models/hooks';
import { makeSchema } from './make-schema';
import directives from './directives';
import { errorLoggingPlugin } from './plugins/error-logging';
import context from './context';
import playground from './playground';

hooks.forEach((hook) => {
  const ctx = context();
  hook(ctx.models, ctx);
});

(async () => {
  const server = new ApolloServer({
    schema: await makeSchema(),
    context,
    schemaDirectives: directives,
    introspection: !process.env.DISABLE_GRAPHQL_INTROSPECTION,
    playground: !process.env.DISABLE_GRAPHQL_PLAYGROUND && playground,
    plugins: [errorLoggingPlugin],
    cacheControl: {
      defaultMaxAge: parseInt(process.env.DEFAULT_CACHE_CONTROL_MAX_AGE) || 0,
    },
  });

  // The `listen` method launches a web server.
  server
    .listen({
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 4000,
    })
    .then(({ server, url }) => {
      console.log(`🚀  Server ready at ${url}`);

      // For nodemon
      process.once('SIGUSR2', () => {
        server.close(() => {
          process.kill(process.pid, 'SIGUSR2');
        });
      });
    });
})();
