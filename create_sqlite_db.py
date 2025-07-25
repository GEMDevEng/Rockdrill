#!/usr/bin/env python3
"""
Create SQLite database with the same structure as the PostgreSQL schema.
This script creates the database tables based on the Alembic migration.
"""

import sqlite3
import os

def create_sqlite_database():
    """Create SQLite database with all tables from the Alembic migration."""
    
    # Remove existing database if it exists
    if os.path.exists('rockdrill.db'):
        os.remove('rockdrill.db')
    
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect('rockdrill.db')
    cursor = conn.cursor()
    
    try:
        # Create users table
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                company VARCHAR(255),
                role VARCHAR(20) NOT NULL DEFAULT 'USER',
                subscription VARCHAR(20) NOT NULL DEFAULT 'FREE',
                preferences TEXT,
                email_verified BOOLEAN NOT NULL DEFAULT 0,
                email_verification_token VARCHAR(255),
                password_reset_token VARCHAR(255),
                password_reset_expires DATETIME,
                last_login_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create indexes for users table
        cursor.execute('CREATE INDEX ix_users_email ON users (email)')
        cursor.execute('CREATE INDEX ix_users_id ON users (id)')
        
        # Create campaigns table
        cursor.execute('''
            CREATE TABLE campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                type VARCHAR(30) NOT NULL,
                schedule TEXT,
                settings TEXT,
                metrics TEXT,
                start_date DATETIME,
                end_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create indexes for campaigns table
        cursor.execute('CREATE INDEX ix_campaigns_id ON campaigns (id)')
        cursor.execute('CREATE INDEX ix_campaigns_user_id ON campaigns (user_id)')
        
        # Create email_templates table
        cursor.execute('''
            CREATE TABLE email_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(30) NOT NULL,
                subject VARCHAR(500) NOT NULL,
                body TEXT NOT NULL,
                placeholders TEXT,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                usage INTEGER NOT NULL DEFAULT 0,
                metrics TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create indexes for email_templates table
        cursor.execute('CREATE INDEX ix_email_templates_id ON email_templates (id)')
        cursor.execute('CREATE INDEX ix_email_templates_user_id ON email_templates (user_id)')
        
        # Create integrations table
        cursor.execute('''
            CREATE TABLE integrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(30) NOT NULL,
                provider VARCHAR(255) NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                config TEXT,
                last_sync_at DATETIME,
                sync_status VARCHAR(20),
                error_message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create indexes for integrations table
        cursor.execute('CREATE INDEX ix_integrations_id ON integrations (id)')
        cursor.execute('CREATE INDEX ix_integrations_user_id ON integrations (user_id)')
        
        # Create leads table
        cursor.execute('''
            CREATE TABLE leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                email VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                company VARCHAR(255),
                title VARCHAR(255),
                phone VARCHAR(50),
                linkedin_url VARCHAR(500),
                website VARCHAR(500),
                industry VARCHAR(255),
                company_size VARCHAR(100),
                location VARCHAR(255),
                score REAL NOT NULL DEFAULT 0.0,
                status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                source VARCHAR(30) NOT NULL,
                tags TEXT,
                custom_fields TEXT,
                enrichment_data TEXT,
                research_data TEXT,
                last_contacted_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create indexes for leads table
        cursor.execute('CREATE INDEX ix_leads_id ON leads (id)')
        cursor.execute('CREATE INDEX ix_leads_user_id ON leads (user_id)')
        cursor.execute('CREATE INDEX ix_leads_email ON leads (email)')
        
        # Create campaign_leads junction table
        cursor.execute('''
            CREATE TABLE campaign_leads (
                campaign_id INTEGER NOT NULL,
                lead_id INTEGER NOT NULL,
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'ACTIVE',
                PRIMARY KEY (campaign_id, lead_id),
                FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
                FOREIGN KEY (lead_id) REFERENCES leads (id)
            )
        ''')
        
        # Create campaign_sequences table
        cursor.execute('''
            CREATE TABLE campaign_sequences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id INTEGER NOT NULL,
                email_template_id INTEGER NOT NULL,
                sequence_order INTEGER NOT NULL,
                delay_days INTEGER NOT NULL DEFAULT 0,
                delay_hours INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
                FOREIGN KEY (email_template_id) REFERENCES email_templates (id)
            )
        ''')
        
        # Create indexes for campaign_sequences table
        cursor.execute('CREATE INDEX ix_campaign_sequences_id ON campaign_sequences (id)')
        cursor.execute('CREATE INDEX ix_campaign_sequences_campaign_id ON campaign_sequences (campaign_id)')
        
        # Create interactions table
        cursor.execute('''
            CREATE TABLE interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id INTEGER,
                lead_id INTEGER NOT NULL,
                type VARCHAR(30) NOT NULL,
                channel VARCHAR(30) NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                subject VARCHAR(500),
                content TEXT,
                scheduled_at DATETIME,
                sent_at DATETIME,
                opened_at DATETIME,
                clicked_at DATETIME,
                replied_at DATETIME,
                metadata TEXT,
                error_message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
                FOREIGN KEY (lead_id) REFERENCES leads (id)
            )
        ''')
        
        # Create indexes for interactions table
        cursor.execute('CREATE INDEX ix_interactions_id ON interactions (id)')
        cursor.execute('CREATE INDEX ix_interactions_campaign_id ON interactions (campaign_id)')
        cursor.execute('CREATE INDEX ix_interactions_lead_id ON interactions (lead_id)')
        
        # Commit all changes
        conn.commit()
        print("✅ SQLite database created successfully with all tables!")
        
        # Verify tables were created
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"\n📋 Created {len(tables)} tables:")
        for table in tables:
            print(f"  - {table[0]}")
            
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    create_sqlite_database()
