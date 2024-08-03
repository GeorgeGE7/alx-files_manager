import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

/**
 * Function to set up routing for all controllers
 * @param {Object} app - Express app instance
 */
function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  /**
   * GET /status - Get status of redis and mongo connection
   * @route GET /status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  /**
   * GET /stats - Get number of users and files in db
   * @route GET /stats
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  /**
   * POST /users - Create a new user
   * @route POST /users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  /**
   * GET /users/me - Get current user
   * @route GET /users/me
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  /**
   * GET /connect - Authenticate user and get token
   * @route GET /connect
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  /**
   * GET /disconnect - Disconnect user
   * @route GET /disconnect
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  /**
   * POST /files - Upload a new file
   * @route POST /files
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  /**
   * GET /files/:id - Get file details
   * @route GET /files/{id}
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  /**
   * GET /files - Get all files
   * @route GET /files
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  /**
   * PUT /files/:id/publish - Publish a file
   * @route PUT /files/{id}/publish
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  /**
   * PUT /files/:id/unpublish - Unpublish a file
   * @route PUT /files/{id}/unpublish
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  /**
   * GET /files/:id/data - Get file data
   * @route GET /files/{id}/data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  router.get('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });
}

export default controllerRouting;
