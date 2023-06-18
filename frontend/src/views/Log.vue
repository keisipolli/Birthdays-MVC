<template>
  <div>
    <h2 class="title">Log File</h2>
    <br>
    <table class="log-table">
      <thead>
      <tr>
        <th>Timestamp</th>
        <th>Event</th>
        <th>Data</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(log, index) in logs" :key="log.timestamp" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
        <td>{{ log.timestamp }}</td>
        <td>{{ log.event }}</td>
        <td>{{ log.data }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.title {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
}

.log-table th,
.log-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.log-table th {
  font-weight: bold;
}

.even-row {
  background-color: #f5f5f5;
}

.odd-row {
  background-color: #ffffff;
}

.log-table tr:last-child td {
  border-bottom: none;
}
</style>

<script>
export default {
  data() {
    return {
      logs: [],
    };
  },
  mounted() {
    this.fetchLogs();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    fetchLogs() {
      fetch('https://localhost:3000/log')
          .then((response) => response.text())
          .then((logs) => {
            const jsonData = logs
                .trim()
                .split('\n')
                .map((line) => {
                  const log = JSON.parse(line);
                  log.timestamp = log.timestamp.split('T')[0];
                  return log;
                });
            this.logs = jsonData;
          })
          .catch((error) => {
            console.error('Error fetching logs:', error);
          });
    },
    startPolling() {
      this.pollingInterval = setInterval(this.fetchLogs, 5000); // Fetch logs every 5 seconds (adjust the interval as needed)
    },
    stopPolling() {
      clearInterval(this.pollingInterval);
    },
  },
};
</script>
