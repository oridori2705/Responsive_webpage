const backToTop = document.getElementById("backtotop");

function checkScroll() {
  /*
      웹페이지가 수직으로 얼마나 스크롤되었는지를 확인하는 값(픽셀 단위로 반환)
      https://developer.mozilla.org/ko/docs/Web/API/Window/pageYOffset
    */
  let pageYOffset = window.scrollY;

  if (pageYOffset !== 0) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

function moveBackToTop() {
  if (window.scrollY > 0) {
    /*
        smooth 하게 스크롤하기
        https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
        */
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

window.addEventListener("scroll", checkScroll);
backToTop.addEventListener("click", moveBackToTop);

/*----------------------------------------------------------------------*/
function transformPrev(event) {
  //event.target : 현재 클릭한 왼쪽 슬라이드버튼요소
  const slidePrev = event.target;
  //slideNext : 오른쪽 슬라이드 버튼요소
  const slideNext = slidePrev.nextElementSibling;

  // ul 태그 선택 : 카드리스트 배열의 부모요소

  const classList = slidePrev.parentElement.parentElement.nextElementSibling;
  // data-position값을 가져옴
  let activeLi = classList.getAttribute("data-position");
  // liList : 카드리스트의 데이터 배열
  const liList = classList.getElementsByTagName("li");

  /* classList.clientWidth 는 ul 태그의 실질적인 너비
   * liList.length * 260 에서 260 은 각 li 요소의 실질 너비(margin 포함)
   * activeLi 는 data-position 에 있는 현재 위치
   * 즉, liList.length * 260 + Number(activeLi) 는 현재 위치부터 오른쪽으로 나열되야 하는 나머지 카드들의 너비
   */

  /* classList.clientWidth < (liList.length * 260 + Number(activeLi)) 의미는
   * 오른쪽으로 나열될 카드들이 넘친 상태이므로, 왼쪽으로 이동이 가능함
   */

  if (classList.clientWidth < liList.length * 260 + Number(activeLi)) {
    // 위치를 왼쪽으로 260 이동 (-260px) -> 슬라이드 오른쪽버튼 활성화
    activeLi = Number(activeLi) - 260;

    /* 위치를 왼쪽으로 260 이동 (-260px)
     * 해당 위치는 변경된 activeLi 값이 적용된 liList.length * 260 + Number(activeLi) 값임
     * 이 값보다, classList.clientWidth (ul 태그의 너비)가 크다는 것은
     * 넘치는 li 가 없다는 뜻으로, prev 버튼은 활성화되면 안됨
     */
    if (classList.clientWidth > liList.length * 260 + Number(activeLi)) {
      //더이상 왼쪽으로 갈 수 가 없음 -> 왼쪽 버튼 비활성화
      slidePrev.style.color = "#cfd8dc";
      slidePrev.classList.remove("slide-prev-hover");
    }
    //오른쪽버튼을 활성화 -> 왼쪽버튼을 눌러서 슬라이드가 왼쪽으로 밀렸다면 무조건 오른쪽버튼은 활성화되야된다.
    slideNext.style.color = "#2f3059";
    slideNext.classList.add("slide-next-hover");
  }

  //ul자체를 activeLi값만큼 이동함 ->data-position
  classList.style.transition = "transform 1s";
  classList.style.transform = "translateX(" + String(activeLi) + "px)";
  classList.setAttribute("data-position", activeLi);
}

//모든 슬라이드버튼의 요소들을 배열로 가져옴
const slidePrevList = document.getElementsByClassName("slide-prev");

//모든 카드리스트의 슬라이드 버튼을 순회하는 것임
for (let i = 0; i < slidePrevList.length; i++) {
  // ul 태그 선택, prev버튼의 부모의 부모의 바로 다음 형제 요소를 선택한 것임
  let classList =
    slidePrevList[i].parentElement.parentElement.nextElementSibling;
  /*카드들의 데이터가 배열로 생성됨 */
  let liList = classList.getElementsByTagName("li");

  // 카드가 ul 태그 너비보다 넘치면, 왼쪽(PREV) 버튼은 활성화하고, 오른쪽(NEXT)는 현재 맨 첫카드 위치이므로 비활성화
  // clientWidth : 요소의 너비
  // 260 : 카드 요소 하나의 너비와 마진(좌,우)을 합한 값
  if (classList.clientWidth < liList.length * 260) {
    slidePrevList[i].classList.add("slide-prev-hover");
    slidePrevList[i].addEventListener("click", transformPrev);
  } else {
    /* 태그 삭제시, 부모 요소에서 removeChild 를 통해 삭제해야 함
           따라서, 1. 먼저 부모 요소를 찾아서,
                 2. 부모 요소의 자식 요소로 있는 PREV 와 NEXT 요소를 삭제함
        */
    const arrowContainer = slidePrevList[i].parentElement;
    arrowContainer.removeChild(slidePrevList[i].nextElementSibling);
    arrowContainer.removeChild(slidePrevList[i]);
  }
}
