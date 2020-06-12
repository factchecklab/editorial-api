import { ApolloServer } from 'apollo-server';

import hooks from './models/hooks';
import { makeSchema } from './make-schema';
import directives from './directives';
import { errorLoggingPlugin } from './plugins/error-logging';
import context from './context';

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

hooks.forEach((hook) => {
  const ctx = context();
  hook(ctx.models, ctx);
});

(async () => {
  const server = new ApolloServer({
    schema: await makeSchema(),
    context,
    schemaDirectives: directives,
    introspection: true,
    plugins: [errorLoggingPlugin],
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
