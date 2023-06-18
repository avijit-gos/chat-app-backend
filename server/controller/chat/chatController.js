/** @format */

const createError = require("http-errors");
const {
  createOneToOneChat,
  fetchChatData,
  createNewGroupChat,
  fetchSingleChatById,
  updatedGroupDetails,
  updateGroupMemebers,
  deleteChatDetails,
  fetchSearchChat,
  joinChatGroup,
  fetchJoingRequestUsers,
  acceptJoin,
  removeJoin,
  updatePrivacySettings,
} = require("../../model/chatModel/chatModel");

class ChatController {
  constructor() {}

  // *** Create a single one to one chat
  async createSingleChat(req, res, next) {
    try {
      if (!req.body) {
        throw createError.Conflict("No user has been seleceted");
      } else {
        const data = await createOneToOneChat(req.body, req.user);
        return res.status(201).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** fetch user related chats
  async getChat(req, res, next) {
    try {
      const data = await fetchChatData(req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Create group chat
  async createGroupChat(req, res, next) {
    try {
      if (!req.body.name.trim()) {
        throw createError.BadRequest("Group name is needed");
      } else if (JSON.parse(req.body.members).length <= 1) {
        throw createError.BadRequest(
          "You need more than 1 user to create a group"
        );
      } else {
        const data = await createNewGroupChat(req.body, req.user);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch single chat
  async fetchSingleChat(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("No parameter is present");
      } else {
        const data = await fetchSingleChatById(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update group details
  async updateGroup(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else if (!req.body.name.trim()) {
        throw createError.BadRequest("Cannot set empty name as group name");
      } else {
        console.log("HERE");
        const data = await updatedGroupDetails(
          req.params.id,
          req.body,
          req.files
        );
        return res.status(200).json({ msg: "Group has been updated", data });
      }
    } catch (error) {
      next(error);
    }
  }

  async removeMemebrs(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else {
        console.log("ID");
        const data = await updateGroupMemebers(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async addMembers(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else {
        console.log("ID");
        const data = await updateGroupMemebers(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteChat(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else {
        const data = await deleteChatDetails(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async searchChat(req, res, next) {
    try {
      if (!req.query.search) {
        throw createError.BadRequest("Inavid request");
      } else {
        const data = await fetchSearchChat(req.query);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async requestToJoin(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Inavid request");
      } else {
        const data = await joinChatGroup(req.params.id, req.user._id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchJoinRequests(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Inavid request");
      } else {
        const data = await fetchJoingRequestUsers(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async acceptJoinRequest(req, res, next) {
    try {
      if (!req.params.id) {
        throw create.BadRequest("Request parameter is not present");
      } else {
        const data = await acceptJoin(
          req.params.id,
          req.body.userId,
          req.body.notiId
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async removeJoinRequest(req, res, next) {
    try {
      if (!req.params.id) {
        throw create.BadRequest("Request parameter is not present");
      } else {
        const data = await removeJoin(
          req.params.id,
          req.body.userId,
          req.body.notiId
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateGroupPrivacy(req, res, next) {
    try {
      if (!req.params.id) {
        throw create.BadRequest("Request parameter is not present");
      } else {
        const data = await updatePrivacySettings(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
