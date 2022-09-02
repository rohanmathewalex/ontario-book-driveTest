
window.addEventListener("DOMContentLoaded", () => {
  let scrollPos = 0;
  const mainNav = document.getElementById("mainNav");
  const headerHeight = mainNav.clientHeight;
  window.addEventListener("scroll", function () {
    const currentTop = document.body.getBoundingClientRect().top * -1;
    if (currentTop < scrollPos) {
      if (currentTop > 0 && mainNav.classList.contains("is-fixed")) {
        mainNav.classList.add("is-visible");
      } else {
        mainNav.classList.remove("is-visible", "is-fixed");
      }
    } else {
      mainNav.classList.remove(["is-visible"]);
      if (
        currentTop > headerHeight &&
        !mainNav.classList.contains("is-fixed")
      ) {
        mainNav.classList.add("is-fixed");
      }
    }
    scrollPos = currentTop;
  });
});

$(document).ready(() => {
  loginPageLoad();
  g2PageLoad();
  gPageLoad();
  appointmentPageLoad();
});

const checkUserInfoForm = function () {
  let incorrect = 0;
  incorrect += checkEmptyField("#streetName");
  incorrect += checkEmptyField("#city");
  incorrect += checkEmptyField("#province");
  incorrect += checkEmptyField("#postalCode");
  incorrect += checkEmptyField("#make");
  incorrect += checkEmptyField("#model");
  incorrect += checkEmptyField("#plateNo");

  const houseNo = $("#houseNo");
  const houseNoValue = houseNo.val().trim();
  if (houseNoValue === "") {
    houseNo.next().text("This field is required");
    incorrect += 1;
  } else if (isNaN(houseNoValue)) {
    houseNo.next().text("Must be a numeric.");
    incorrect += 1;
  } else {
    houseNo.next().text("");
  }
  houseNo.val(houseNoValue);

  let now = new Date();
  let nextYear = now.getFullYear() + 1;
  const carMadeYear = $("#year");
  const carMadeYearValue = carMadeYear.val().trim();
  if (carMadeYearValue === "") {
    carMadeYear.next().text("This field is required");
    incorrect += 1;
  } else if (isNaN(carMadeYearValue)) {
    carMadeYear.next().text("Must be a numeric.");
    incorrect += 1;
  } else if (carMadeYearValue <= 1990) {
    carMadeYear.next().text("Must be greater than 1990.");
    incorrect += 1;
  } else if (carMadeYearValue > nextYear) {
    carMadeYear.next().text("Must be less than " + nextYear + ".");
    incorrect += 1;
  } else {
    carMadeYear.next().text("");
  }
  carMadeYear.val(carMadeYearValue);

  return incorrect;
};

const checkEmptyField = function (selector) {
  const element = $(selector);
  const value = element.val().trim();
  if (value === "") {
    element.next().text("This field is required");
    return 1;
  }
  element.next().text("");
  element.val(value);
  return 0;
};

const isValidDate = ($inputDate) => {
  const v = $inputDate.val().trim();
  let dateParts = v.split("-");
  let date = new Date(dateParts.join("/"));
  if (v === "") {
    return false;
  } else if (
    dateParts.length !== 3 ||
    isNaN(dateParts[0]) ||
    date === "Invalid Date"
  ) {
    return false;
  }
  return true;
};

const loginPageLoad = function () {
  $("#userName").blur(function () {
    const name = $("#userName").val().trim();
    if (name.length > 0) {
      $.ajax({
        url: `/users/signup/preCheck?name=${name}`,
      }).then(function (result) {
        if (result.exist) {
          $("#userName")
            .next()
            .text("Username already exists, please enter another one");
          $("#signUpForm :submit").prop("disabled", true);
        } else {
          $("#userName").next().text("");
          $("#signUpForm :submit").prop("disabled", false);
        }
      });
    }
  });

  $("#signUpForm").submit((event) => {
    let incorrect = 0;
    incorrect += checkEmptyField("#userName");
    incorrect += checkEmptyField("#password");
    incorrect += checkEmptyField("#confirmPassword");

    const password = $("#password");
    const passwordValue = password.val();
    const confirmPassword = $("#confirmPassword");
    const confirmPasswordValue = confirmPassword.val();
    if (passwordValue !== confirmPasswordValue) {
      confirmPassword.next().text("Password does not match, please check.");
      incorrect += 1;
    }
    if (incorrect > 0) {
      event.preventDefault();
    }
  });

  $("#loginForm").submit((event) => {
    let incorrect = 0;
    incorrect += checkEmptyField("#loginUserName");
    incorrect += checkEmptyField("#loginPassword");
    if (incorrect > 0) {
      event.preventDefault();
    }
  });
};

const loadTime = function (availableSlots, selectedSlotId, date, inUseSlot) {
  fetch(`/users/timeslot?date=${date}`)
    .then((response) => response.json())
    .then((json) => {
      availableSlots.empty();
      selectedSlotId.val("");
      const slots = json["slots"];
      if (inUseSlot) {
        slots.push(inUseSlot);
        selectedSlotId.val(inUseSlot.id);
      }
      slots.sort(function (a, b) {
        const x = a.time.replace(":", "");
        const y = b.time.replace(":", "");
        return x - y;
      });
      for (let slot of slots) {
        const style = slot["inUse"] ? "btn-time-selected" : "btn-time";
        availableSlots.append(
          $(
            `<button type="button" class="${style}" id="${slot.id}">${slot.time}</button>`
          )
        );
      }
      if (slots.length > 0) {
        availableSlots.children().each(function () {
          $(this).click(() => {
            if ($(this).attr("class") === "btn-time") {
              availableSlots
                .find(".btn-time-selected")
                .attr("class", "btn-time");
              $(this).attr("class", "btn-time-selected");
              selectedSlotId.val(this.id);
            }
          });
        });
      } else {
        availableSlots.append("There is no available timeslots");
      }
    });
};

const g2PageLoad = function () {
  const appointmentDate = $("#appointmentDateG2");
  const availableSlots = $("#availableSlots");
  const selectedSlotId = $("#selectedSlotId");

  // If the user has specified an appointment time, display it
  const adg2 = $("#adg2");
  const atg2 = $("#atg2");
  const ssid = $("#ssid");
  if (ssid.val() && ssid.val() !== "") {
    availableSlots.empty();
    availableSlots.append("loading ... ...");
    loadTime(availableSlots, selectedSlotId, appointmentDate.val(), {
      id: ssid.val(),
      time: atg2.val(),
      inUse: true,
    });
  }

  appointmentDate.change(function () {
    if (isValidDate(appointmentDate)) {
      const inUseSlot =
        adg2.val() === appointmentDate.val()
          ? {
              id: ssid.val(),
              time: atg2.val(),
              inUse: true,
            }
          : undefined;
      availableSlots.empty();
      availableSlots.append("loading ... ...");
      loadTime(
        availableSlots,
        selectedSlotId,
        appointmentDate.val(),
        inUseSlot
      );
    }
  });

  $("#g2Form").submit((event) => {
    let incorrect = 0;
    incorrect += checkEmptyField("#firstName");
    incorrect += checkEmptyField("#lastName");
    incorrect += checkUserInfoForm();

    const licenseNo = $("#licenseNo");
    if (licenseNo.length > 0) {
      const licenseNoValue = licenseNo.val().trim();
      if (licenseNoValue === "") {
        licenseNo.next().text("This field is required");
        incorrect += 1;
      } else {
        licenseNo.next().text("");
      }
      licenseNo.val(licenseNoValue);
    }

    // check whether the birthday is eligible for application
    const dob = $("#dob");
    const dobValue = dob.val().trim();
    let dateParts = dobValue.split("-");
    let date = new Date(dateParts.join("/"));
    if (dobValue === "") {
      dob.next().text("This field is required");
      incorrect += 1;
    } else if (
      dateParts.length !== 3 ||
      isNaN(dateParts[0]) ||
      date === "Invalid Date"
    ) {
      // check valid date format
      dob.next().text("Please follow YYYY/MM/DD format.");
      incorrect += 1;
    } else {
      dob.next().text("");
    }
    dob.val(dobValue);

    if (!isValidDate(appointmentDate)) {
      appointmentDate.next().text("Please input valid date.");
      incorrect += 1;
    } else {
      appointmentDate.next().text("");
    }

    const value = selectedSlotId.val().trim();
    if (value === "") {
      selectedSlotId.next().text("Please select one timeslot.");
      incorrect += 1;
    } else {
      selectedSlotId.next().text("");
    }

    if (incorrect > 0) {
      event.preventDefault();
    }
  });
};

const gPageLoad = function () {
  const appointmentDate = $("#appointmentDateG");
  const availableSlots = $("#availableSlotsG");
  const selectedSlotId = $("#selectedSlotIdG");

  // If the user has specified an appointment time, display it
  const adg = $("#adg");
  const atg = $("#atg");
  const ssid = $("#ssidg");
  if (ssid.val() && ssid.val() !== "") {
    availableSlots.empty();
    availableSlots.append("loading ... ...");
    loadTime(availableSlots, selectedSlotId, appointmentDate.val(), {
      id: ssid.val(),
      time: atg.val(),
      inUse: true,
    });
  }

  appointmentDate.change(function () {
    if (isValidDate(appointmentDate)) {
      const inUseSlot =
        adg.val() === appointmentDate.val()
          ? {
              id: ssid.val(),
              time: atg.val(),
              inUse: true,
            }
          : undefined;
      availableSlots.empty();
      availableSlots.append("loading ... ...");
      loadTime(
        availableSlots,
        selectedSlotId,
        appointmentDate.val(),
        inUseSlot
      );
    }
  });

  $("#gUpdateForm").submit((event) => {
    let incorrect = 0;
    const value = selectedSlotId.val().trim();
    if (value === "") {
      selectedSlotId.next().text("Please select one timeslot.");
      incorrect += 1;
    } else {
      selectedSlotId.next().text("");
    }
    incorrect += checkUserInfoForm();
    if (incorrect > 0) {
      event.preventDefault();
    }
  });
};

const appointmentPageLoad = function () {
  const appointmentDate = $("#appointmentDate");
  const slotContainer = $("#slotContainer");
  const selectedSlots = $("#selectedSlots");

  if (appointmentDate.length === 0) return;

  const loadAndDisplaySlots = (() => {
    const defaultSlots = [];
    for (let i = 9; i < 15; i++) {
      defaultSlots.push({ time: i + ":00", available: true });
      defaultSlots.push({ time: i + ":30", available: true });
    }

    return (date, $timeContainer, $selectedSlots) => {
      fetch(`/admin/timeslot?date=${date}`)
        .then((response) => response.json())
        .then((json) => {
          $timeContainer.empty();
          $selectedSlots.val("");
          const slots = defaultSlots.filter(
            (s) => !json["slots"].includes(s.time)
          );
          for (let slot of slots) {
            $timeContainer.append(
              $(`<button type="button" class="btn-time">${slot.time}</button>`)
            );
          }
          $timeContainer.children().each(function () {
            $(this).click(() => {
              if ($(this).attr("class") === "btn-time") {
                $(this).attr("class", "btn-time-selected");
                $selectedSlots.val($selectedSlots.val() + $(this).text() + ",");
              } else {
                $(this).attr("class", "btn-time");
                $selectedSlots.val(
                  $selectedSlots.val().replace($(this).text() + ",", "")
                );
              }
            });
          });
        });
    };
  })();

  // default load today's timeslots
  const today = new Date();
  let todayText = today.getFullYear() + "-";
  todayText += (today.getMonth() + 1).toString().padStart(2, "0") + "-";
  todayText += today.getDate().toString().padStart(2, "0");
  appointmentDate.val(todayText);
  loadAndDisplaySlots(todayText, slotContainer, selectedSlots);

  // reload time slots when date changes
  appointmentDate.change(function () {
    if (isValidDate(appointmentDate)) {
      loadAndDisplaySlots(appointmentDate.val(), slotContainer, selectedSlots);
    }
  });

  $("#appointmentForm").submit((event) => {
    let incorrect = 0;
    if (!isValidDate(appointmentDate)) {
      appointmentDate.next().text("Please input valid date.");
      incorrect += 1;
    } else {
      appointmentDate.next().text("");
    }

    const value = selectedSlots.val().trim();
    if (value === "") {
      selectedSlots.next().text("Please select at least one timeslot.");
      incorrect += 1;
    } else {
      selectedSlots.next().text("");
    }

    if (incorrect > 0) {
      event.preventDefault();
    }
  });
};
