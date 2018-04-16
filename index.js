const fastify = require('fastify')();
const Joi = require('joi');

const { WALLET_CREATE_STREAM } = require('./constants');
const { Wallet } = require('./db');
const DataStream = require('./utils/DataStream');

/**
 * Create a new wallet
 **/
fastify.post('/wallet', {
  schema: {
    body: {
      userId: Joi.number().positive().required(),
      type: Joi.string().required()
    }
   },
   schemaCompiler: schema => data => Joi.validate(data, schema)
}, async(request, reply) => {
  const { userId, type } = request.body;

  // Send a message to create the wallet for a specific user.
  const data = { userId, type }

  // Fire-and-forget
  try {
    DataStream.write(WALLET_CREATE_STREAM, data);
    return reply.code(201).send({});
  } catch (error) {
    console.error(error)
  }
});


/**
 * Fetch a specific wallet
 **/
fastify.get('/wallet/:id', {
  schema: {
    params: {
      id: Joi.number().positive().required()
    }
   },
   schemaCompiler: schema => data => Joi.validate(data, schema)
}, async (request, reply) => {
  const { id } = request.params;

  const wallet = await Wallet.query().where('id', id).first();
  return reply.send({
    data: wallet
  })
})



const start = async () => {
  try {
    await fastify.listen(3002);
    fastify.log.info('server listening on 3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
