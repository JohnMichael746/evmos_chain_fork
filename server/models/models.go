package models

import (
    "time"
)

type User struct {
	Id       uint   `json:"id"`
	Address  string `json:"address"`
}

type Account struct {
	Id        uint   	`json:"id"`
	Address   string 	`json:"address"`
	Status    int 		`json:"status"`
	CreatedAt time.Time	`json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
