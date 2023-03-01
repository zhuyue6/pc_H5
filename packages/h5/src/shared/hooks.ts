import { onMounted, onUnmounted, type Ref } from "vue";

export function useDomResizeRem(domRef: Ref<HTMLElement>) {
  function resize() {
    const fontSize =
      domRef.value.clientWidth >= 750
        ? "1px"
        : `${domRef.value.clientWidth / 750}px`;
    document.querySelector("html").style.fontSize = fontSize;
  }
  onMounted(() => {
    window.addEventListener("resize", resize);
    resize();
  });
  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });
}
