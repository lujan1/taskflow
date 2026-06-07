const express = require('express');
const router = express.Router();
const { testPythonBridge } = require('../services/pythonService');

// Endpoint en Node.js: POST /api/ai/test-node-to-python
router.post('/test-node-to-python', async (req, res) => {
  const { prompt, userId } = req.body;

  try {
    // Node le pasa el balón a Python
    const pythonResponse = await testPythonBridge(prompt, userId);
    
    // Node te responde lo que Python le devolvió
    return res.status(200).json({
      message: "Node.js recibió tu petición y se comunicó con Python con éxito.",
      pythonData: pythonResponse
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;