// Lightweight in-memory stand-in for the Log Mongoose model.

let logs = [];
let nextId = 1;

function reset() {
  logs = [];
  nextId = 1;
}

const FakeLog = {
  async create(data) {
    const log = {
      _id: String(nextId++),
      userEmail: data.userEmail,
      action: data.action,
      details: data.details,
      createdAt: new Date(),
    };
    logs.push(log);
    return log;
  },

  find() {
    let results = [...logs];
    const chain = {
      sort(sortSpec) {
        const [field, dir] = Object.entries(sortSpec)[0];
        results = [...results].sort((a, b) =>
          dir === -1 ? (a[field] < b[field] ? 1 : -1) : a[field] < b[field] ? -1 : 1
        );
        return chain;
      },
      limit(n) {
        results = results.slice(0, n);
        return chain;
      },
      then(resolve, reject) {
        return Promise.resolve(results.map((l) => ({ ...l }))).then(resolve, reject);
      },
    };
    return chain;
  },

  __reset: reset,
  __all: () => logs.map((l) => ({ ...l })),
};

module.exports = FakeLog;