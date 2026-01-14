"use client";
import React, { useEffect, useRef, useState } from "react";
import Input from "@/components/Input";
import Link from "../Link";
import { DatePicker, TimePicker } from "rsuite";
import Button from "../Button";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";
import { getUserList } from "@/services/userServices";
import { editNotification, getNotificationById } from "@/services/notificationServices";
import DynamicDropdown from "../DynamicDropdown";
import NotificationDynamicDropdown from "./NotificationDropdown";

const EditNotification = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [notificationData, setNotificationData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [target, setTarget] = useState("");
  const [recipientsTarget, setRecipientsTarget] = useState([]);

  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [selectedRecipientType, setSelectedRecipientType] = useState(null);
  const [loading, setLoading] = useState(false);
  const scheduleDateRef = useRef(null);
  const scheduleTimeRef = useRef(null);

  const typeData = [
    { id: 1, title: "All" },
    { id: 2, title: "Users" },
    { id: 3, title: "Club Managers" },
  ];

  const fetchNotificationDetails = async () => {
    setLoading(true);
    const res = await getNotificationById(id);
    if (res?.status) {
      const notif = res.data;
      setNotificationData(notif);
      setTitle(notif.title || "");
      setAnswer(notif.description || "");

      if (notif.targetUsers && notif.targetUsers.length) {
        const mappedRecipients = notif.targetUsers.map(user => ({
          id: user._id,
          title: `${user.firstName} ${user.lastName}`.trim() || "N/A",
        }));
        setRecipientsTarget(mappedRecipients);
      }


      if (notif.scheduledAt) {
        const scheduledDateObj = new Date(notif.scheduledAt);
        setScheduleDate(scheduledDateObj);
        const timeObj = new Date();
        timeObj.setHours(scheduledDateObj.getHours());
        timeObj.setMinutes(scheduledDateObj.getMinutes());
        setScheduleTime(timeObj);
      }

      const targetRole = notif.targetRole;
      const dropdownType =
        typeData.find((type) => {
          if (targetRole === "NormalUser") return type.title === "Users";
          if (targetRole === "ClubManager") return type.title === "Club Managers";
          return type.title === "All";
        }) || typeData[0];

      setSelectedRecipientType(dropdownType);
      setTarget(dropdownType.title);

      setInitialValues({
        title: notif.title || "",
        description: notif.description || "",
        targetUsers: notif.targetUsers?.map(user => user._id) || [],
        scheduledAt: notif.scheduledAt ? new Date(notif.scheduledAt).getTime() : null,
        targetRole: notif.targetRole || "All",
      });

    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchNotificationDetails();
  }, [id]);

  const fetchUserDetails = async (userType = "All") => {
    setLoading(true);
    const payload = { page: 1, limit: 1000, userType };
    const res = await getUserList(payload);
    if (res.status) {
      setData(res.data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    const userTypeFromQuery = router.query.userType || "All";

    const selectedType =
      typeData.find((type) => {
        if (userTypeFromQuery === "All") return type.title === "All";
        if (userTypeFromQuery === "NormalUser") return type.title === "Users";
        if (userTypeFromQuery === "ClubManager") return type.title === "Club Managers";
        return false;
      }) || typeData[0];

    setSelectedRecipientType(selectedType);
    setTarget(selectedType.title);
    fetchUserDetails(userTypeFromQuery);
  }, [router.query.userType]);


  const handleSubmit = async () => {
    let scheduledAt = null;
    if (scheduleDate && scheduleTime) {
      scheduledAt = new Date(
        scheduleDate.getFullYear(),
        scheduleDate.getMonth(),
        scheduleDate.getDate(),
        scheduleTime.getHours(),
        scheduleTime.getMinutes()
      ).toISOString();
    }

    const mappedInitialRole = initialValues?.targetRole;
    const currentRole =
      selectedRecipientType?.title === "Users"
        ? "NormalUser"
        : selectedRecipientType?.title === "Club Managers"
          ? "ClubManager"
          : "All";

    const hasChanged =
      title !== initialValues?.title ||
      answer !== initialValues?.description ||
      JSON.stringify(recipientsTarget.map(u => u.id)) !== JSON.stringify(initialValues?.targetUsers) ||
      new Date(scheduledAt).getTime() !== initialValues?.scheduledAt ||
      currentRole !== mappedInitialRole;


    if (!hasChanged) {
      toast.info("Nothing changed to update.");
      setTimeout(() => {
        router.push("/notifications-management");
      }, 1500);
      return;
    }

    const payload = {};

    if (title !== initialValues?.title) {
      payload.title = title;
    }
    if (answer !== initialValues?.description) {
      payload.description = answer;
    }

    const currentTargetUsers = recipientsTarget.map((u) => u.id);
    if (JSON.stringify(currentTargetUsers) !== JSON.stringify(initialValues?.targetUsers)) {
      payload.targetUsers = currentTargetUsers;
    }

    if (currentRole !== initialValues?.targetRole) {
      payload.targetRole = currentRole;
    }

    if (scheduledAt) {
      const scheduledAtTime = new Date(scheduledAt).getTime();
      if (scheduledAtTime !== initialValues?.scheduledAt) {
        payload.scheduledAt = new Date(scheduledAt).toISOString();
      }
    }


    setLoading(true);
    try {
      const response = await editNotification(id, payload);
      if (response?.status) {
        router.push("/notifications-management");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error editing notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="px-6 rounded-lg">
        <div className="mt-4 mb-6">
          <h2 className="text-black-3 text-sm font-normal cursor-pointer">
            <Link href="/notifications-management" className="text-black-3 hover:text-black-3">
              Notification Management
            </Link>
            <span className="text-black-3 text-sm font-medium">&gt; Edit Notification</span>
          </h2>
        </div>

        <div className="w-[500px] bg-white p-6 rounded-2xl">
          <div className="mb-6">
            <label className="block text-black-4 text-base font-medium mb-3">
              Notification Title
            </label>
            <Input
              type="text"
              placeholder="Enter here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="outline-none placeholder-[#5D5D5D] placeholder:text-sm bg-grey-6 flex items-center rounded-lg px-4 py-2"
            />
          </div>

          <div className="mb-5">
            <label className="block text-black-3 text-sm font-medium mb-2">
              Notification Message
            </label>
            <textarea
              placeholder="Enter message here"
              rows="3"
              className="w-full outline-none bg-grey-6 rounded-lg px-4 py-2 placeholder-[#5D5D5D] placeholder:text-sm"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-black-3 text-sm font-medium mb-2">
              Recipient Type
            </label>
            <DynamicDropdown
              data={typeData}
              placeholder="Select recipient type"
              value={selectedRecipientType}
              callback={(item) => {
                setSelectedRecipientType(item);
                setTarget(item.title);
                let userTypeParam = "All";
                if (item.title === "Users") userTypeParam = "NormalUser";
                else if (item.title === "Club Managers") userTypeParam = "ClubManager";

                setRecipientsTarget([]);
                fetchUserDetails(userTypeParam);
                router.push(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, userType: userTypeParam },
                  },
                  undefined,
                  { shallow: true }
                );
              }}
            />

          </div>

          <div className="mb-6">
            <label className="block text-black-3 text-sm font-medium mb-2">
              Specific Recipients
            </label>
            <NotificationDynamicDropdown
              data={data.map((user) => ({
                id: user._id,
                title: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A",
              }))}
              placeholder="Select specific recipients"
              value={recipientsTarget}
              callback={(selectedItems) => setRecipientsTarget(selectedItems)}
              loading={loading}
            />

          </div>

          <div className="mb-4">
            <label className="block text-black-3 text-sm font-medium mb-2">
              Schedule Date & Time <span className="text-grey-1">(Optional)</span>
            </label>
            <div className="flex space-x-4">
              <div className="relative border rounded-md flex-1">
                <DatePicker
                  ref={scheduleDateRef}
                  format="yyyy-MM-dd"
                  oneTap
                  placeholder="Select Date"
                  value={scheduleDate}
                  onChange={setScheduleDate}
                  appearance="subtle"
                  shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>

              <div className="relative border rounded-md flex-1">
                <TimePicker
                  ref={scheduleTimeRef}
                  format="hh:mm aa"
                  showMeridiem
                  oneTap={false}
                  placeholder="Select Time"
                  value={scheduleTime}
                  onChange={(time) => setScheduleTime(time)}
                  block
                  cleanable
                  className="w-full outline-none placeholder-[#5D5D5D] placeholder:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 mb-9">
          <Button onClick={handleSubmit} className="w-40">
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditNotification;
