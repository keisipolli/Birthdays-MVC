<template>
  <div>
    <h1>Your Friends Birthdays Book</h1>
    <ul>
      <li v-for="birthday in birthdays" :key="birthday.id" class="birthday">
        <span class="name">{{ birthday.name }}</span>: <span class="date">{{ birthday.date }}</span>
        <button @click="editBirthdayModal(birthday)">Edit</button>
        <button class ="delete" @click="deleteBirthday(birthday.id)">Delete</button>

      </li>
    </ul>
    <form @submit.prevent="addBirthday" class="add-birthday">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="newBirthday.name">
      </div>
      <div>
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="newBirthday.date">
      </div>
      <button type="submit">Add Birthday</button>
    </form>
    <div class="edit-birthday-modal" v-if="showEditModal">
      <div class="modal-overlay" @click="closeEditModal"></div>
      <div class="modal-container">
        <h2>Edit Birthday</h2>
        <form @submit.prevent="saveEditedBirthday">
          <div>
            <label for="edited-name">Name:</label>
            <input type="text" id="edited-name" v-model="editedBirthday.name">
          </div>
          <div>
            <label for="edited-date">Date:</label>
            <input type="date" id="edited-date" v-model="editedBirthday.date">
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeEditModal">Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { $http } from '../utils/$http';
import EditBirthdayModal from '../views/EditBirthdayModal.vue';
import { io, Socket } from 'socket.io-client';

let socket: Socket;


export default defineComponent({
  name: 'Birthdays',

  components: {
    EditBirthdayModal
  },

  data() {
    return {
      birthdays: [],
      newBirthday: {
        name: '',
        date: ''
      },
      showEditModal: false,
      editedBirthday: null
    };
  },

  created() {
    // Fetch all existing birthdays from the server
    this.fetchBirthdays()
        .then(() => {
          // Establish Socket.IO connection after fetching birthdays
          socket = io('https://localhost:3000', {
            withCredentials: true,
            extraHeaders: {
              'Access-Control-Allow-Origin': 'https://localhost:3000', // Replace with your frontend URL
            },
          });

          // Listen for the 'birthdayAdded' event
          socket.on('birthdayAdded', (birthday) => {
            // Handle the event, e.g., update the list of birthdays
            console.log('Birthday added:', birthday);
            this.birthdays.push(birthday);
          });

          // Listen for the 'birthdayDeleted' event
          socket.on('birthdayDeleted', (id) => {
            // Handle the event, e.g., remove the deleted birthday from the list
            console.log('Birthday deleted:', id);
            const index = this.birthdays.findIndex(b => b.id === id);
            if (index >= 0) {
              this.birthdays.splice(index, 1);
            }
          });

          // Listen for the 'birthdayUpdated' event
          socket.on('birthdayUpdated', (updatedBirthday) => {
            // Handle the event, e.g., update the corresponding birthday in the list
            console.log('Birthday updated:', updatedBirthday);
            const index = this.birthdays.findIndex(b => b.id === updatedBirthday.id);
            if (index >= 0) {
              this.birthdays.splice(index, 1, updatedBirthday);
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
  },

  computed: {
    isSessionIdEmpty() {
      return !localStorage.getItem('sessionId')
    },
  },

  methods: {

    // FETCH BIRTHDAYS
    async fetchBirthdays() {
      try {
        const response = await $http.get('/birthdays', {});
        console.log('fetchBirthdays response', response);
        this.birthdays = response.map(birthday => {
          return {
            ...birthday,
            date: new Date(birthday.date).toISOString().split('T')[0]
          };
        });
        console.log('birthdays', this.birthdays);
      } catch (error) {
        console.error(error);
      }
    },

    // EDIT BIRTHDAY
    editBirthdayModal(birthday) {
      console.log("Editing birthday modal for birthday:", birthday);
      this.editedBirthday = Object.assign({}, birthday);
      this.showEditModal = true;
    },

    closeEditModal() {
      console.log("Closing edit modal");
      this.showEditModal = false;
      this.editedBirthday = null;
    },

    async saveEditedBirthday() {
      try {
        console.log(`Editing birthday ${this.editedBirthday.id}...`);
        const isoDate = new Date(this.editedBirthday.date).toISOString();
        const date = isoDate.split('T')[0];
        const updatedBirthday = {
          name: this.editedBirthday.name,
          date: date,
          id: this.editedBirthday.id
        };
        const response = await $http.patch(`/birthdays/${this.editedBirthday.id}`, updatedBirthday);
        console.log('saveEditedBirthday response', response);
        const index = this.birthdays.findIndex(b => b.id === this.editedBirthday.id);
        if (index >= 0) {
          this.birthdays.splice(index, 1, updatedBirthday);
        }
        this.closeEditModal();
        // Emit the 'birthdayUpdated' event to the server
        socket.emit('birthdayUpdated', updatedBirthday);
      } catch (error) {
        console.error(error);
      }
    },

    // ADD BIRTHDAY
    async addBirthday() {
      try {
        console.log('Adding birthday...');
        const newBirthday = {
          name: this.newBirthday.name,
          date: this.newBirthday.date
        };
        const response = await $http.post('/birthdays', newBirthday);
        console.log('addBirthday response', response);
        newBirthday.id = response.id; // update the id property with the server response
        this.birthdays.push(newBirthday);
        socket.emit('birthdayAdded', newBirthday);
      } catch (error) {
        console.error(error);
      }
      this.newBirthday.name = '';
      this.newBirthday.date = '';
    },

    // DELETE BIRTHDAY
    async deleteBirthday(id) {
      try {
        console.log(`Deleting birthday ${id}...`);
        if (id) {
          const response = await $http.delete(`/birthdays/${id}`);
          console.log('deleteBirthday response', response);
          const index = this.birthdays.findIndex(b => b.id === id);
          if (index >= 0) {
            this.birthdays.splice(index, 1);
          }
          //Emits the event to the server
          socket.emit('birthdayDeleted', id);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});

</script>
<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li.birthday {
  margin-bottom: 8px;
}

.birthday .name {
  font-weight: bold;
}

.add-birthday {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-birthday label {
  display: block;
  margin-bottom: 8px;
}

.add-birthday input[type="text"],
.add-birthday input[type="date"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}

.edit-birthday-modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-birthday-modal input[type="text"],
.edit-birthday-modal input[type="date"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}


.modal-container input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}

.modal-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.modal-container h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.modal-buttons button {
  padding: 8px 16px;
  margin-left: 8px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: red;
}

button {
  padding: 8px 16px;
  margin-left: 8px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  margin-left: 0;
}

button:hover {
  background-color: #0050a4;
}

button:active {
  background-color: #002c5e;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
}

button.delete {
  background-color: red;
}

</style>