class CreatePaintings < ActiveRecord::Migration[7.0]
  def change
    create_table :paintings do |t|
      t.string :subject
      t.references :style, null: false, foreign_key: true
      t.references :theme, null: false, foreign_key: true
      t.references :composition, null: false, foreign_key: true
      t.references :color_palette, null: false, foreign_key: true
      t.references :medium, null: false, foreign_key: true
      t.string :size
      t.string :texture_effect
      t.string :light_shadow
      t.references :additional_features, null: false, foreign_key: true
      t.references :perspective, null: false, foreign_key: true
      t.string :historical_context

      t.timestamps
    end
  end
end
