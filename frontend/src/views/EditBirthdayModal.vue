<template>
  <!-- Modal element that appears when editing a birthday -->
  <div class="modal" v-if="show">
    <div class="modal-content">
      <!-- Close button to exit the modal -->
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Edit Birthday</h2>
      <!-- Form to edit the birthday's name and date -->
      <form @submit.prevent="saveBirthday">
        <div>
          <label for="edited-name">Name:</label>
          <!-- Input field to edit the birthday's name -->
          <input type="text" id="edited-name" v-model="birthday.name">
        </div>
        <div>
          <label for="edited-date">Date:</label>
          <!-- Input field to edit the birthday's date -->
          <input type="date" id="edited-date" v-model="selectedDate">
        </div>
        <!-- Button to save changes to the birthday -->
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'EditBirthdayModal',
  props: {
    // Boolean indicating whether or not the modal should be displayed
    show: {
      type: Boolean,
      required: true
    },
    // The birthday object being edited
    birthday: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    // Computed property to convert the birthday's date string to a date object and back
    const selectedDate = computed({
      get() {
        return props.birthday.date.slice(0, 10); // return the date part of the string
      },
      set(value) {
        // Convert the selected date to a date object and set the time to midnight UTC
        const dateObject = new Date(value);
        dateObject.setUTCHours(0, 0, 0, 0);
        const isoDate = dateObject.toISOString();
        const dateOnly = isoDate.slice(0, 10); // get only the date part
        // Emit an event to update the birthday with the new date
        emit('update:birthday', {
          ...props.birthday,
          date: dateOnly
        });
      }
    });

    // Function to save the changes made to the birthday
    const saveBirthday = () => {
      emit('save');
    };

    // Return the selectedDate and saveBirthday functions to be used in the template
    return { selectedDate, saveBirthday };
  }
});
</script>

<style>
/* Styles for the modal and close button */
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>