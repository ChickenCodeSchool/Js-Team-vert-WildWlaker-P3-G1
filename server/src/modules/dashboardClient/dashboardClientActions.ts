import type { RequestHandler } from "express";
import createEventFormRepository from "../createEventForm/createEventFormRepository";
import dashboardClientRepository from "./dashboardClientRepository";

// The B of BREAD - Browse (Read All) operation

// Retrieve past events the user attended
const browsePastEvents: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const events = await dashboardClientRepository.readPastEvents(userId);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Retrieve upcoming events the user is registered for
const browseUpcomingEvents: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const events = await dashboardClientRepository.readUpcomingEvents(userId);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Retrieve upcoming space bookings for a specific user
const browseUpcomingBookings: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const bookings =
      await dashboardClientRepository.readUpcomingBookings(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Retrieve full billing history for a specific user
const browseBookingHistory: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const bookings = await dashboardClientRepository.readBookingHistory(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Retrieve past space bookings for a specific user
const browseOldBookings: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const bookings = await dashboardClientRepository.readOldBookings(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Retrieve client stats
const browseStats: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const stats = await dashboardClientRepository.readStats(userId);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// Create claim client
const addClaim: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const claim = {
      title: req.body.title,
      category: req.body.category,
      message: req.body.message,
      users_id: userId,
      activity_id: Number(req.body.activity_id),
    };
    const insertId = await dashboardClientRepository.createClaim(claim);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Read booking for create Invoice for client
const readInvoice: RequestHandler = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const invoice = await dashboardClientRepository.readInvoiceById(
      bookingId,
      userId,
    );
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

// Create event for client
const addEventRequest: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }

    const spaceId = Number(req.body.space_id);
    const timeSlotId = Number(req.body.time_slot_id);
    const startDate = req.body.start_date as string;

    const slotTaken = await createEventFormRepository.isEventSlotTaken(
      spaceId,
      startDate,
      timeSlotId,
    );

    if (slotTaken) {
      res.status(409).json({
        message: "Ce créneau est déjà pris pour cet espace.",
      });
      return;
    }

    const insertId = await dashboardClientRepository.createEventRequest({
      name: req.body.name,
      description: req.body.description,
      start_date: startDate,
      end_date: req.body.end_date,
      space_id: spaceId,
      time_slot_id: timeSlotId,
      url_image:
        req.body.url_image ?? "/assets/images/events/default-event.webp",
      users_id: userId,
      price_unit: Number(req.body.price_unit) ?? 0,
    });
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Lire event for client
const browseEventRequests: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }
    const requests = await dashboardClientRepository.readEventRequests(userId);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export default {
  browsePastEvents,
  browseUpcomingEvents,
  browseUpcomingBookings,
  browseBookingHistory,
  browseOldBookings,
  browseStats,
  addClaim,
  readInvoice,
  addEventRequest,
  browseEventRequests,
};
