# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_05_25_210926) do
  create_table "additional_features", force: :cascade do |t|
    t.text "features"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "artists", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "color_palettes", force: :cascade do |t|
    t.text "colors"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "compositions", force: :cascade do |t|
    t.text "qualities"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "contributions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "wall_id", null: false
    t.index ["user_id"], name: "index_contributions_on_user_id"
    t.index ["wall_id"], name: "index_contributions_on_wall_id"
  end

  create_table "mediums", force: :cascade do |t|
    t.string "type"
    t.text "properties"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "paintings", force: :cascade do |t|
    t.string "subject"
    t.integer "style_id", null: false
    t.integer "theme_id", null: false
    t.integer "composition_id", null: false
    t.integer "color_palette_id", null: false
    t.integer "medium_id", null: false
    t.string "size"
    t.string "texture_effect"
    t.string "light_shadow"
    t.integer "additional_features_id", null: false
    t.integer "perspective_id", null: false
    t.string "historical_context"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["additional_features_id"], name: "index_paintings_on_additional_features_id"
    t.index ["color_palette_id"], name: "index_paintings_on_color_palette_id"
    t.index ["composition_id"], name: "index_paintings_on_composition_id"
    t.index ["medium_id"], name: "index_paintings_on_medium_id"
    t.index ["perspective_id"], name: "index_paintings_on_perspective_id"
    t.index ["style_id"], name: "index_paintings_on_style_id"
    t.index ["theme_id"], name: "index_paintings_on_theme_id"
  end

  create_table "perspectives", force: :cascade do |t|
    t.string "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "styles", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "themes", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["name"], name: "index_users_on_name", unique: true
  end

  create_table "walls", force: :cascade do |t|
    t.integer "owner_id"
    t.text "context"
    t.datetime "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
    t.boolean "is_closed"
    t.index ["owner_id"], name: "index_walls_on_owner_id"
  end

  add_foreign_key "contributions", "walls"
  add_foreign_key "walls", "users", column: "owner_id"
end
