class AddFieldsToWall < ActiveRecord::Migration[7.0]
  def change
    add_column :walls, :image_url, :string
    add_column :walls, :is_closed, :boolean, default: false
  end
end
