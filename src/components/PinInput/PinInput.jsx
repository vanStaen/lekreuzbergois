import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

import "./PinInput.less";
import { pageStore } from "../../store/pageStore";

export const PinInput = observer(() => {
  const [isNope, setIsNope] = useState(false);
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const [windowInnerHeight, setWindowInnerHeight] = useState(
    window.innerHeight
  );
  const { t } = useTranslation();

  const keyUpHandler = (event) => {
    if (event.key === "Backspace") {
      return;
    } else if (event.key === "ArrowRight") {
      event.srcElement.nextElementSibling.focus();
      return;
    }
    console.log(event.key);
    const target = event.srcElement;
    const maxLength = parseInt(target.attributes["maxLength"].value, 10);
    const myLength = target.value.length;
    if (myLength >= maxLength) {
      let next = target;
      while ((next = next.nextElementSibling)) {
        if (next == null) break;
        if (next.tagName.toLowerCase() == "input") {
          next.focus();
          break;
        }
      }
    }
    if (myLength === 0) {
      let next = target;
      while ((next = next.previousElementSibling)) {
        if (next == null) break;
        if (next.tagName.toLowerCase() == "input") {
          next.focus();
          break;
        }
      }
    }
  };

  const keyDownHandler = (event) => {
    if (event.key === "Enter") {
      onPressEnterHandler();
    } else if (event.key === "Backspace") {
      setIsReadyToEnter(false);
      setIsNope(false);
      var target = event.srcElement;
      //target.value = "";
    } else if (event.key === "Escape") {
      pageStore.setShowPinInput(false);
    } else {
      //emptying the cell in keyDown
      var target = event.srcElement;
      target.value = "";
      setIsReadyToEnter(false);
      setIsNope(false);
    }
  };

  const onPinChangeHandler = () => {
    const pin1 = document.getElementById("pin1").value;
    const pin2 = document.getElementById("pin2").value;
    const pin3 = document.getElementById("pin3").value;
    const pin4 = document.getElementById("pin4").value;
    if (pin1 !== "" && pin2 !== "" && pin3 !== "" && pin4 !== "") {
      setIsReadyToEnter(true);
    }
  };

  const onPressEnterHandler = () => {
    const pin1 = document.getElementById("pin1").value;
    const pin2 = document.getElementById("pin2").value;
    const pin3 = document.getElementById("pin3").value;
    const pin4 = document.getElementById("pin4").value;
    if (pin1 !== "" && pin2 !== "" && pin3 !== "" && pin4 !== "") {
      if (
        String(pin1 + pin2 + pin3 + pin4) === String(process.env.SECRET_PIN)
      ) {
        pageStore.setShowSensiblePictures(true);
        pageStore.setShowPinInput(false);
      } else {
        setIsNope(true);
        document.getElementById("pin1").value = "";
        document.getElementById("pin2").value = "";
        document.getElementById("pin3").value = "";
        document.getElementById("pin4").value = "";
        document.getElementById("pin1").focus();
      }
    }
  };

  const resetWindowInnerHeight = () => {
    setWindowInnerHeight(window.innerHeight);
  };

  useEffect(() => {
    const pinCode = document.getElementById("pin-code");
    pinCode.addEventListener("keyup", keyUpHandler);
    pinCode.addEventListener("keydown", keyDownHandler);
    window.addEventListener("resize", resetWindowInnerHeight);
    return () => {
      pinCode.removeEventListener("keyup", keyUpHandler);
      pinCode.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("resize", resetWindowInnerHeight);
    };
  }, [keyDownHandler, keyUpHandler, resetWindowInnerHeight]);

  const handleCloseClick = () => {
    console.log("clicked to close pin component");
    pageStore.setShowPinInput(false);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="pin__background"
        style={{ height: windowInnerHeight }}
      ></div>
      <div className="pin__noiseBackground"></div>
      <div
        className="pin__container"
        style={{ height: windowInnerHeight }}
        onClick={handleCloseClick}
      >
        <div className="pin__infoTop">{t("pin.enterAccessCode")}</div>
        <div id="pin-code" className="pin-code">
          <input
            id="pin1"
            type="number"
            maxLength="1"
            onChange={onPinChangeHandler}
            onClick={handlePinClick}
            autoFocus
          />
          <input
            id="pin2"
            type="number"
            maxLength="1"
            onChange={onPinChangeHandler}
            onClick={handlePinClick}
          />
          <input
            id="pin3"
            type="number"
            maxLength="1"
            onChange={onPinChangeHandler}
            onClick={handlePinClick}
          />
          <input
            id="pin4"
            type="number"
            maxLength="1"
            onChange={onPinChangeHandler}
            onClick={handlePinClick}
          />
        </div>
        <div className="pin__infoBottom">
          {isNope
            ? t("pin.nope")
            : isReadyToEnter && <>{t("pin.pressEnter")} &#9166; </>}
        </div>
      </div>
    </>
  );
});
