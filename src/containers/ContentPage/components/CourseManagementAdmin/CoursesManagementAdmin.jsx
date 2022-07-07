import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Switch, Table, Typography } from "antd";
import * as courseApis from "apis/features/Courses/Courses";
import ViewCourse from "containers/ContentPage/components/ViewCourse/ViewCourse";
import React, { useState } from "react";

import styled from "styled-components";

const CourseManagementAdminWrapper = styled.div`
  &&& {
    padding: 30px;
    .table_categories {
      &:not(:first-child) {
        margin-left: 8px;
        padding-left: 8px;
        border-left: 1px solid black;
      }
    }
  }
`;

function CourseManagementAdmin(props) {
  const [coursesData, setCoursesData] = useState([]);
  const [visible, setVisible] = useState(false);
  const hideSwitchHandler = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    (async () => {
      try {
        const response = await courseApis.getAllCourses();
        setCoursesData(response.data.data.result);
      } catch {
        throw new Error(`Get all course failed!`);
      }
    })();
  }, []);

  const convertData = () => {
    const data = coursesData[6];
    const courseItem = {};
    if (coursesData.length > 0) {
      let basic = {
        title: data?.title,
        shortDescription: data?.shortDescription,
        description: data?.description,
        objective: data?.objective,
        requirements: data?.requirements,
        levelIds: data?.levels.reduce((a, b) => {
          return [...a, b.id];
        }, []),
        audioLanguageIds: data?.audioLanguages.reduce((a, b) => {
          return [...a, b.id];
        }, []),
        closeCaptionIds: data?.closeCaptions.reduce((a, b) => {
          return [...a, b.id];
        }, []),
        categoryIds: data?.categories.reduce((a, b) => {
          return [...a, b.id];
        }, []),
      };
      let price = {
        price: data?.price,
        salePrice: data?.salePrice,
        isFree: data?.isFree,
        isRequiredEnroll: data?.isRequiredEnroll,
      };
      const sectionsArray = data?.sections;
      sectionsArray.forEach((section) => {
        section.lectures?.forEach((lecture) => {
          lecture.type = "Lecture";
          lecture.key = lecture.title;
          lecture.attachments.forEach((attachment) => {
            delete attachment.lectureId;
            delete attachment.assignmentId;
          });
        });
        section.quizzes?.forEach((quiz) => {
          quiz.type = "Quiz";
          quiz.key = quiz.title;
          quiz.questions?.forEach((question) => {
            question.key = question.title;
            delete question.quizId;
            question.options.forEach((option) => {
              delete option.questionId;
            });
          });
        });
        section.assignments?.forEach((assignment) => {
          assignment.type = "Assignment";
          assignment.key = assignment.title;
          assignment.attachments.forEach((attachment) => {
            delete attachment.lectureId;
            delete attachment.assignmentId;
          });
        });
        const tempArray = section?.lectures?.concat(
          section.quizzes,
          section.assignments
        );
        tempArray?.sort((a, b) => a.ordinalNumber > b.ordinalNumber);
        delete section.lectures;
        delete section.quizzes;
        delete section.assignments;
        section.contents = tempArray;
      });
      courseItem.id = data?.id;
      courseItem.sections = sectionsArray;
      courseItem.basic = basic;
      courseItem.price = price;
      courseItem.media = {
        previewVideoType: data?.previewVideoType,
        previewVideoUrl: data?.previewVideoUrl,
        previewVideoId: data?.previewVideoId,
        imageUrl: data?.imageUrl,
        previewVideoName: data?.previewVideoName,
      };
      if (data?.previewVideoType === "HTML5(MP4)") {
        courseItem.media.localVideoUrl = data?.previewVideoUrl;
      }
      console.log(courseItem);
      return courseItem;
    }
  };

  const switchActiveHandler = (id) => {};

  const columns = [
    {
      title: "",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      render: (text, record) => (
        <img
          style={{ width: "92px", height: "72px" }}
          alt=""
          src={record.imageUrl}
        />
      ),
    },
    {
      align: "center",
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      align: "center",
      title: "Author",
      dataIndex: "",
      key: "author",
      render: (_, record) => record.user.fullName,
    },
    {
      align: "center",
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (text === 0 ? 0 : `$${text}`),
    },
    {
      align: "center",
      title: "Category",
      dataIndex: "",
      key: "categories",
      render: (_, record) =>
        record.categories.map((category, index) => (
          <span className="table_categories" key={index}>
            {category.name}
          </span>
        )),
    },
    {
      title: "Active",
      dataIndex: "",
      key: "toggleActive",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          onConfirm={() => switchActiveHandler(record.id)}
          onCancel={() => console.log("cancel")}
          title={`Are you sure you want to ${
            false ? "deactivate" : "activate"
          } this account`}
          content={
            <Space
              style={{ width: "100%", justifyContent: "center" }}
              size={32}
            >
              <Button onClick={hideSwitchHandler}>Cancel</Button>
              <Button type="primary" danger onClick={hideSwitchHandler}>
                Accept
              </Button>
            </Space>
          }
          trigger="click"
        >
          <Switch
            onClick={() => console.log(true)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={record.isActive}
            checked={record.isActive}
          />
        </Popconfirm>
      ),
    },
    {
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => (
        <Space>
          <Button type="primary">View Detail</Button>
        </Space>
      ),
    },
  ];

  return (
    <CourseManagementAdminWrapper>
      {coursesData.length > 0 && <ViewCourse courseItem={convertData()} />}
      <Typography.Title>Course Management</Typography.Title>
      <Table rowKey="id" columns={columns} dataSource={coursesData}></Table>
    </CourseManagementAdminWrapper>
  );
}

export default CourseManagementAdmin;
