"use strict";

$(document).ready(() => {
  const load = (status) => {
    $.ajax({
      url: "examiner/userList?status=" + status,
      type: "GET",
    }).then(function (result) {
      $("#driverList").empty();
      for (const user of result.users) {
        const appointment =
          user.testType === "G2" ? user.appointmentId : user.appointmentIdG;
        const item = `<div class="row gx-4">
                <div class="col-md-2 my-2">${user.firstName}</div>
                <div class="col-md-2 my-2">${user.lastName}</div>
                <div class="col-md-2 my-2">${user.carInfo.plateNo}</div>
                <div class="col-md-3 my-2">${
                  appointment.date.substring(0, 10) + " " + appointment.time
                }</div>
                <div class="col-md-1 my-2">${user.testType}</div>
                <div class="col-md-2 my-2"><button type="button" class="edit-btn">edit</button></div>
                <input type="hidden" value="${user.passG2}">
                <input type="hidden" value="${user.passG}">
                <input type="hidden" value="${user.commentG2}">
                <input type="hidden" value="${user.commentG}">
                <input type="hidden" value="${user._id}">
            </div>
            <hr>`;
        $("#driverList").append(item);
      }
      $("#driverList")
        .off("click", "button")
        .on("click", "button", function () {
          const box = $("#commentBox");
          box.empty();

          const firstName = $(this)
            .parent()
            .prev()
            .prev()
            .prev()
            .prev()
            .prev()
            .text();
          const lastName = $(this).parent().prev().prev().prev().prev().text();
          const plateNo = $(this).parent().prev().prev().prev().text();
          const appointmentTime = $(this).parent().prev().prev().text();
          const testType = $(this).parent().prev().text();
          const passG2 = $(this).parent().next().val();
          const passG = $(this).parent().next().next().val();
          const commentG2 = $(this).parent().next().next().next().val();
          const commentG = $(this).parent().next().next().next().next().val();
          const id = $(this).parent().next().next().next().next().next().val();

          let s = `<div class="row gx-4 mb-2">
                            <div class="col-md-4">Name:</div>
                            <div class="col-md-8">${
                              firstName + " " + lastName
                            }</div>
                          </div>
                          <div class="row gx-4 mb-2">
                            <div class="col-md-4">PlateNo:</div>
                            <div class="col-md-8">${plateNo}</div>
                          </div>
                          <div class="row gx-4 mb-2">
                            <div class="col-md-4">Appointment Time:</div>
                            <div class="col-md-8">${appointmentTime}</div>
                          </div>
                          <div class="row gx-4 mb-2">
                            <div class="col-md-4">Test Type:</div>
                            <div class="col-md-8">${testType}</div>
                          </div>`;
          box.append($(s));

          let canUpdate = true;
          if (testType === "G2") {
            if (passG2 === "true") {
              s = `<div class="row gx-4 mb-2">
                                <div class="col-md-4">Comment of G2:</div>
                                <div class="col-md-8">${commentG2}</div>
                              </div>`;
              canUpdate = false;
            } else {
              s = `<div class="row gx-4 mb-2">
                                <div class="col-md-4">Comment of G2:</div>
                                <div class="col-md-8">
                                    <textarea id="commentTextG2" name="commentTextG2" rows="4" cols="33"></textarea>
                                </div>
                              </div>
                              <div class="row gx-4 mb-2">
                                <div class="col-md-4">Pass/Fail of G2:</div>
                                <div class="col-md-8">
                                    <label for="pass">Pass</label>
                                    <input type="radio" id="pass" name="g2_pass_fail" value="true">
                                    <label for="fail">Fail</label>
                                    <input type="radio" id="fail" name="g2_pass_fail" value="false">
                                </div>
                              </div>
                              <input type="hidden" id="id" name="id" value="${id}">`;
            }
            box.append($(s));
          } else if (testType === "G") {
            if (passG === "true") {
              s = `<div class="row gx-4 mb-2">
                                <div class="col-md-4">Comment of G:</div>
                                <div class="col-md-8">${commentG}</div>
                              </div>`;
              canUpdate = false;
            } else {
              s = `<div class="row gx-4 mb-2">
                                <div class="col-md-4">Comment of G:</div>
                                <div class="col-md-8">
                                    <textarea id="commentTextG" name="commentTextG" rows="4" cols="33"></textarea>
                                </div>
                              </div>
                              <div class="row gx-4 mb-2">
                                <div class="col-md-4">Pass/Fail of G:</div>
                                <div class="col-md-8">
                                    <label for="pass">Pass</label>
                                    <input type="radio" id="pass" name="g_pass_fail" value="pass">
                                    <label for="fail">Fail</label>
                                    <input type="radio" id="fail" name="g_pass_fail" value="fail">
                                </div>
                              </div>
                              <input type="hidden" id="id" name="id" value="${id}">`;
            }
            box.append($(s));
          }

          let btn = canUpdate
            ? [
                { text: "update", click: update },
                {
                  text: "cancel",
                  click: function () {
                    dialog.dialog("close");
                  },
                },
              ]
            : [
                {
                  text: "cancel",
                  click: function () {
                    dialog.dialog("close");
                  },
                },
              ];
          $("#commentDialog").dialog("option", "buttons", btn);

          box.find(":radio").checkboxradio();
          dialog.dialog("open");
        });
    });
  };

  load("all");

  $("#filterAll").click(function () {
    $(this).attr("class", "btn btn-time-selected align-bottom me-5");
    $("#filterG2").attr("class", "btn btn-time align-bottom me-5");
    $("#filterG").attr("class", "btn btn-time align-bottom me-5");
    load("all");
  });
  $("#filterG2").click(function () {
    $(this).attr("class", "btn btn-time-selected align-bottom me-5");
    $("#filterAll").attr("class", "btn btn-time align-bottom me-5");
    $("#filterG").attr("class", "btn btn-time align-bottom me-5");
    load("g2");
  });
  $("#filterG").click(function () {
    $(this).attr("class", "btn btn-time-selected align-bottom me-5");
    $("#filterG2").attr("class", "btn btn-time align-bottom me-5");
    $("#filterAll").attr("class", "btn btn-time align-bottom me-5");
    load("g");
  });

  function update() {
    if (!$("#pass").is(":checked") && !$("#fail").is(":checked")) {
      alert("Please select Pass or Fail.");
      return;
    }
    $("#commentForm").submit();
  }

  const dialog = $("#commentDialog").dialog({
    autoOpen: false,
    height: 500,
    width: 600,
    modal: true,
  });
});
