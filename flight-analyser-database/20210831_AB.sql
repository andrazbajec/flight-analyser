DROP TABLE IF EXISTS Country;
DROP TABLE IF EXISTS QuoteCarrier;
DROP TABLE IF EXISTS Quote;
DROP TABLE IF EXISTS Place;
DROP TABLE IF EXISTS Carrier;

CREATE TABLE Carrier
(
    CarrierID INT PRIMARY KEY,
    Name      TEXT

);

CREATE TABLE Place
(
    PlaceID        INT PRIMARY KEY,
    Name           TEXT,
    Type           TEXT,
    IataCode       TEXT,
    SkyscannerCode TEXT,
    CityName       TEXT,
    CityID         TEXT,
    CountryName    TEXT
);

CREATE TABLE Quote
(
    QuoteID       INT PRIMARY KEY AUTO_INCREMENT,
    Price         FLOAT,
    Direct        SMALLINT(1),
    OriginID      INT,
    DestinationID INT,
    DepartureDate DATETIME,
    DateAdded     DATETIME DEFAULT NOW(),
    Country       TEXT,
    FOREIGN KEY (OriginID) REFERENCES Place (PLaceID),
    FOREIGN KEY (DestinationID) REFERENCES Place (PlaceID)
);

CREATE TABLE QuoteCarrier
(
    QuoteCarrierID INT PRIMARY KEY AUTO_INCREMENT,
    QuoteID        INT,
    CarrierID      INT,
    FOREIGN KEY (QuoteID) REFERENCES Quote (QuoteID),
    FOREIGN KEY (CarrierID) REFERENCES Carrier (CarrierID)
);

CREATE TABLE Country
(
    CountryID INT PRIMARY KEY AUTO_INCREMENT,
    Code      TEXT,
    Name      TEXT
);