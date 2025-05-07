# -*- coding: UTF-8 -*-
import contextlib
from typing import Any, Generator, Optional

from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from sqlalchemy.pool import QueuePool

from common.logger import log
from models.db.base import Base


class PostgresWrapper:
    """Wrapper for PostgreSQL database operations using SQLAlchemy."""

    def __init__(self, url: str, echo: bool = False, pool_size: int = 32, max_overflow: int = 32):
        """
        Initialize PostgreSQL wrapper.

        Args:
            url: Database connection URL
            echo: Whether to log SQL queries
            pool_size: Connection pool size
            max_overflow: Maximum overflow connections
        """
        self.url = url
        self.echo = echo
        self.pool_size = pool_size
        self.max_overflow = max_overflow
        self.engine: Optional[Engine] = None
        self.session = None

    def connect_pg(self) -> None:
        """Establish connection to PostgreSQL database."""
        try:
            self.engine = create_engine(
                self.url,
                echo=self.echo,
                poolclass=QueuePool,
                pool_pre_ping=True,
                pool_size=self.pool_size,
                max_overflow=self.max_overflow,
                pool_recycle=16
            )
        except Exception as e:
            log.exception(f"Failed to connect to database: {e}")
            raise

    def create_tables(self) -> None:
        """Create all tables defined in Base metadata."""
        if not self.engine:
            raise ValueError("Database engine not initialized. Call connect_pg() first.")

        try:
            log.info("Creating SQL tables")
            Base.metadata.create_all(self.engine)
            log.info("Tables created successfully")
        except Exception as e:
            log.exception(f"Failed to create tables: {e}")
            raise

    def get_session(self) -> Session:
        """Get a new database session."""
        if not self.engine:
            raise ValueError("Database engine not initialized. Call connect_pg() first.")

        if not self.session:
            session_maker = sessionmaker(bind=self.engine)
            self.session = scoped_session(session_maker)
        return self.session()

    @contextlib.contextmanager
    def session_scope(self) -> Generator[Session, Any, None]:
        """
        Context manager for database session handling with automatic commit/rollback.

        Yields:
            Session: Database session
        """
        session = None
        try:
            session = self.get_session()
            yield session
            session.commit()
        except Exception:
            if session:
                session.rollback()
            raise
        finally:
            if session:
                session.close()
