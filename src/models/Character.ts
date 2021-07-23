import mongoose from "mongoose";
import { ICharacter } from "../interfaces/ICharacter";
import Activity from "../models/Activity";
const CharacterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
    user_id: {
      type: String,
    },
    user_nickname : {
      type : String,
    },
    characterName: {
      type: String,
    },
    characterIndex: {
      type: Number,
    },
    characterImageIndex: {
      type: Number,
    },
    characterLevel: {
      type: Number,
    },
    characterPrivacy: {
      type: Boolean,
    },
    characterBirth: {
      type: String,
    },
    recentActivityTime : {
      type: String,
    },
    activityCount: {
      type: Number,
    },
    countPercentage: {
      type: Number,
    },
    activity: [
      {
        activityIndex: {
          type: Number,
          required: true,
        },
        activityContent: {
          type: String,
          required: true,
        },
        activityImage: {
          type: String,
        },
        activityYear: {
          type: String,
          required: true,
        },
        activityMonth: {
          type: String,
          required: true,
        },
        activityDay: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICharacter & mongoose.Document>(
  "Character",
  CharacterSchema
);
