import { ref, onMounted, onUnmounted, type Ref } from "vue";

export function useDomHight(domRef: Ref<HTMLElement>) {
  const height = ref();
  function resize() {
    height.value = domRef.value?.clientHeight;
  }
  onMounted(() => {
    window.addEventListener("resize", resize);
    resize();
  });
  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });
  return height;
}
