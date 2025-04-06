import { ref } from 'vue';

export function useNotification() {
  const snackbar = ref({
    visible: false,
    message: '',
    color: 'success',
    timeout: 3000,
  });

  const showNotification = (message: string, color: string = 'success', timeout: number = 3000) => {
    console.log(snackbar);
    snackbar.value = {
      visible: true,
      message,
      color,
      timeout,
    };
  };

  return {
    snackbar,
    showNotification,
  };
}
