// import express from "express";
import auth from "../middleware/auth";
import upload from "../utils/s3";
const express = require("express");
const router = express.Router();

import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require("moment");

/**
 *  @route Post user/activity/add
 *  @desc create new activity
 *  @access Public
 */

//updateOne, image 업로드

router.post("/add", auth, async (req, res) => {
  console.log(req.body.user.id);
  const time = moment();
  const { activityContent } = req.body;
  const characterIndex = req.body.user.id;

  const lastActivity = await Activity.find({
    characterIndex: req.body.characterIndex,
  }).sort({ _id: -1 });
  console.log(lastActivity);

  // var activityIndex = lastActivity[0]["activityIndex"] + 1;
  let activityIndex = 1;
  if (lastActivity.length) {
    activityIndex = lastActivity[0]["activityIndex"] + 1;
  }
  var activityDate = time.format("YYYYMMDDHHmmss");

  try {
    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      // activityImage: req.body.file.location,
      activityDate: activityDate,
      characterIndex: characterIndex,
    });

    await newActivity.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
      data: newActivity,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});


router.post("/upload", upload.single("image"), auth, async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);

    const {
      activityContent,
      activityYear,
      activityMonth,
      activityDay,
      characterIndex,
    } = req.body;

    const lastActivity = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: req.body.characterIndex,
    })
      .sort({ _id: -1 })
      .select({ _id: 0 });

    var activityIndex = lastActivity[0]["activityIndex"] + 1;

    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: req.file.location,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: characterIndex,
    });

    await newActivity.save();

    res.json({
      status: 200,
      success: true,
      message: " 용켸.성공.하셧웁니댜 ^00^ ??",
      data: {
        text: req.body.text,
        image: req.file.location,
        contentType: req.file.contentType,
      },
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  }
});

/**
 *  @route Post activity/test
 *  @desc create new activity test
 *  @access Public
 */

// 모델 테스트
router.post("/test", upload.single("activityImage"), auth, async (req, res) => {
  const time = moment();
  var activityUpdateTime = time.format("YYYYMMDDHHmmss");

  const {
    activityContent,
    activityYear,
    activityMonth,
    activityDay,
    characterIndex,
  } = req.body;
  var activityIndex = 0;

  try {
    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const lastActivity = await Character
    .find({user_id: req.body.user.id, characterIndex: characterIndex,}, { _id : false, activity : true });
    console.log("lastActivitiy 개수 : " , lastActivity[0]['activity'].length);
  
    // 만약, 캐릭터의 activity가 비어있다면 activityIndex를 1로 설정해줌
    if ( lastActivity[0]['activity'].length == 0 ) {
      activityIndex = 1;
      console.log("첫 게시글입니다, activityIndex를 " , activityIndex , "(으)로 설정했습니다.");
    } else {
      // 그렇지 않으면 lastActivity에 담겨있는 것들중에서 제일 마지막 것의 인덱스를 lastIndex에 담아줌
      const lastIndex = lastActivity[0]['activity'].length - 1;
      activityIndex = lastActivity[0]['activity'][lastIndex]['activityIndex'] + 1;
      console.log("activityIndex를 " , activityIndex , "(으)로 설정했습니다.");
    }

    const newActivity = {
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: req.file.location,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: characterIndex,
    };

    await Character.findOneAndUpdate({characterIndex : characterIndex}, { $push : { activity:  newActivity } });
    await Character.findOneAndUpdate({characterIndex : characterIndex}, { ResentActivityTime : activityUpdateTime });
    
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
