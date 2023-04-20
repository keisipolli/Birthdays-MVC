<template>
  <div>
    <h1>Birthdays</h1>
    <ul>
      <li v-for="birthday in birthdays" :key="birthday.id" class="birthday">
        <span class="name">{{ birthday.name }}</span>: <span class="date">{{ birthday.date }}</span>
        <button @click="editBirthdayModal(birthday)">Edit</button>
        <button @click="deleteBirthday(birthday.id)">Delete</button>

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
      <button type="button" @click="signOut">Sign Out</button>
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
import { $http } from '../utils/http';
import EditBirthdayModal from '../views/EditBirthdayModal.vue';

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


  mounted() {
    this.fetchBirthdays();
  },

  computed: {
    isSessionIdEmpty() {
      return !localStorage.getItem('sessionId')
    },
  },

  methods: {

    //Add signOut method
    signOut() {
      // Send a DELETE request to the backend
      $http.delete('/sessions', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('sessionId')
        }
      }).then(response => {
        // Remove sessionId from localStorage
        localStorage.removeItem('sessionId');

        // Redirect to main page
        this.$router.push('/');
      });
    },


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
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});

</script>
<style scoped>
/*.birthday {*/
/*  margin-bottom: 1rem;*/
/*}*/

/*.name {*/
/*  font-weight: bold;*/
/*}*/

/*.date {*/
/*  margin-left: 0.5rem;*/
/*  color: #999;*/
/*}*/

/*.add-birthday {*/
/*  margin-top: 2rem;*/
/*}*/

/*.modal {*/
/*  position: fixed;*/
/*  top: 0;*/
/*  left: 0;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  background-color: rgba(0, 0, 0, 0.5);*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/

/*.modal-content {*/
/*  background-color: white;*/
/*  padding: 2rem;*/
/*  border-radius: 4px;*/
/*}*/

body {
  background-color: #f4f4f4;
}

.edit-birthday-modal {
  background-color: #f4f4f4;
}

h1, h2 {
  font-size: 2.5rem;
  font-weight: bold;
}

form {
  padding: 1rem;
}

form div {
  margin-bottom: 1rem;
}

form button {
  margin-right: 1rem;
}

form button[type="submit"] {
  background-color: #007bff;
  color: #fff;
}

li button, .modal-buttons button[type="button"] {
  background-color: #dc3545;
  color: #fff;
}

form button[type="submit"]:hover,
form button[type="submit"]:focus {
  background-color: #0062cc;
}

li button:hover, li button:focus,
.modal-buttons button[type="button"]:hover,
.modal-buttons button[type="button"]:focus {
  background-color: #c82333;
}

</style>