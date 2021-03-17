import { reactive, ref } from '@vue/composition-api';

export const param = reactive({
  nodeParam: 'connexion',
  edgeParams: {
    edge: { sid: -1, tid: -1, name: 1 },
    showDialog: false
  }
});

export const arc = ref(1);
