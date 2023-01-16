package controllers

import (
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	// "github.com/golang-jwt/jwt/v4"

	"github.com/khrees2412/convas/database"
	"github.com/khrees2412/convas/models"
)

type Account struct {
	Id        uint   	`json:"id"`
	Address   string 	`json:"address"`
	Status    int 		`json:"status"`
	CreatedAt time.Time	`json:"created_at"`
	UpdatedAt time.Time `json:"deleted_at"`
}

var Secretkey = os.Getenv("SECRETKEY")
	
func GetAccounts(c *fiber.Ctx) error {
		
	var accounts []models.Account
	database.DB.Find(&accounts)
	fmt.Println("Found accounts..")
	c.Status(fiber.StatusOK)

	return c.JSON(fiber.Map{
		"message": "Found accounts",
		"data": accounts,
	})
}

func UpdateAccount(c *fiber.Ctx) error {
	paramid := c.Params("id")
	data := new(Account)

	// cookie := c.Cookies("jwt")

	// token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
	// 	return []byte(Secretkey), nil
	// })

	// if err != nil {
	// 	c.Status(fiber.StatusUnauthorized)
	// 	return c.JSON(fiber.Map{
	// 		"message": "unauthenticated",
	// 	})
	// }

	if err := c.BodyParser(data); err != nil {
		return err
	}
	
	accountstatus := data.Status

	// claims, _ := token.Claims.(*jwt.StandardClaims)
	// user_ID := claims.Issuer

	// var user models.User
	// database.DB.Where("id = ?", user_ID).Find(&user)
	// database.DB.Where("id = ?", data.Id).Find(&user)
	
	// if user.Id == 0 {
	// 	c.Status(fiber.StatusUnauthorized)
	// 	return c.JSON(fiber.Map{
	// 		"message": "unauthenticated",
	// 	})
	// }
	
	var account models.Account
	fmt.Println(paramid)
	database.DB.Where("id = ?", paramid).First(&account)
	account.Status = accountstatus
	account.UpdatedAt = time.Now()
	database.DB.Save(&account)
	c.Status(fiber.StatusOK)
	return c.JSON(fiber.Map{
		"message": "Account Updated successfully",
	})
}
	
func FilterAccounts(c *fiber.Ctx) error {
	paramkeyword := c.Params("keyword")
		
	var accounts []models.Account
	database.DB.Where("address LIKE ?", "%" + paramkeyword + "%").Find(&accounts)
	fmt.Println("Found accounts..")
	c.Status(fiber.StatusOK)

	return c.JSON(fiber.Map{
		"message": "Found accounts",
		"data": accounts,
	})
}