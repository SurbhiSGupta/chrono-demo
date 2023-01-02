/* monitoring.js */
'use strict';

const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { MeterProvider }  = require('@opentelemetry/sdk-metrics-base');

const meter = new MeterProvider({
  exporter: new PrometheusExporter({port: 9091}),
}).getMeter('prometheus');

const requestCount = meter.createCounter("requests_surbhi_dev", {
  description: "Count all incoming requests",
  monotonic: true,
  labelKeys: ["metricOrigin"],
});

const boundInstruments = new Map();

const {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} = require('@opentelemetry/sdk-trace-base');
const opentelemetry = require('@opentelemetry/api');

const provider = new BasicTracerProvider();

module.exports.countAllRequests = () => {
  return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
      const labels = { route: req.path };
      const boundCounter = requestCount.bind(labels);
      boundInstruments.set(req.path, boundCounter);
    }

    boundInstruments.get(req.path).add(1);
    next();
  };
};

// Configure span processor to send spans to the exporter
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

// This is what we'll access in all instrumentation code
module.exports.tracer = opentelemetry.trace.getTracer(
  'example-basic-tracer-node'
);