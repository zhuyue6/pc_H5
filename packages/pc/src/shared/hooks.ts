import { ref, onMounted, onUnmounted, type Ref, nextTick } from "vue";

export function useDomHight(domRef: Ref<HTMLElement>) {
  const height = ref();
  function resize() {
    nextTick(() => {
      height.value = domRef.value?.clientHeight;
    });
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
