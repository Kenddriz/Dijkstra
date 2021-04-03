import { reactive, Ref, ref } from '@vue/composition-api';

export const param = reactive({
  nodeParam: 'connexion',
  edgeParams: {
    edge: { sid: -1, tid: -1, name: 1 },
    showDialog: false
  }
});

export const arc: Ref<number | ''> = ref(1);
