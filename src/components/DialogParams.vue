<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-img src="img/undraw_Data_points_re_vkpq.svg" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          text-color="warning"
          icon="delete_forever"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
          @click="remove"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Mise à jour
          </div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="delete_forever" />
            effacer
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model.number="cost" type="number" square label="Coût">
          <template v-slot:prepend>
            <q-icon name="accessible" />
          </template>
        </q-input>
        <div class="text-caption text-grey">
          Saisir le coût de l'arc
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="primary" label="Valider" @click="submit" />
        <q-btn flat color="primary" round label="Fermer" @click="cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Edge } from './compositions/types';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DialogParams',
  props: {
    edge: Object as () => Edge,
    remove: Function,
    submitFunctionName: {
      type: String,
      required: true
    },
    cancel: Function,
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    cost: 1
  }),
  methods: {
    submit() {
      this.$emit(this.submitFunctionName, this.cost);
    }
  }
});
</script>

<style scoped></style>
