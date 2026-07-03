import type { RequestHandler } from "express";
import databaseLeLocal from "../../../database/client";
import eventRepository from "../event/eventRepository";
import cartRepository from "./cartRepository";

// Browse — GET /api/cart/:userId
// Retourne tous les articles du panier avec le détail des événements
const browse: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const items = await cartRepository.readAll(userId);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// Add — POST /api/cart
// Body attendu : { user_id, event_id, quantity, total_price }

const addEvent: RequestHandler = async (req, res, next) => {
  const connection = await databaseLeLocal.getConnection();
  try {
    // middleware a déjà tout converti en nombres.
    const { users_id, event_id, quantity, total_price } = req.body;

    await connection.beginTransaction();

    const remainingSlots = await eventRepository.readRemainingSlotsByEvent(
      connection,
      event_id,
    );

    if (remainingSlots === null) {
      await connection.rollback();
      res.sendStatus(404);
      return;
    }

    if (quantity > remainingSlots) {
      await connection.rollback();
      res.status(409).json({ remaining_slots: remainingSlots });
      return;
    }

    const newItem = {
      users_id,
      id_activity: event_id,
      quantity,
      total_price,
    };

    const insertId = await cartRepository.create(connection, newItem);
    // ON COMMIT pour valider définitivement en BDD
    await connection.commit();
    // ON RÉPOND au front après le succès du commit
    res.status(201).json({ insertId });
  } catch (err) {
    // Si ça plante n'importe où, on annule tout
    await connection.rollback();
    next(err);
  } finally {
    // TRÈS IMPORTANT : On libère la connexion pour les autres utilisateurs
    connection.release();
  }
};

// Edit — PATCH /api/cart/:id
// Body attendu : { quantity }
const edit: RequestHandler = async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.id); // À garder si tu ne valides pas req.params avec Joi
    const { quantity } = req.body; // number validé avec joi

    const affectedRows = await cartRepository.updateQuantity(
      cartItemId,
      quantity,
    );

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

// Destroy — DELETE /api/cart/:id
// Supprime un article précis du panier
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.id);
    const affectedRows = await cartRepository.destroy(cartItemId);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

// DestroyAll — DELETE /api/cart/user/:userId
// Vide tout le panier d'un utilisateur (ex: après paiement)
const destroyAll: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    await cartRepository.destroyAll(userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { browse, addEvent, edit, destroy, destroyAll };
